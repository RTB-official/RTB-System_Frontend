/**
 * 강민지 계정 생성 및 프로필 추가 스크립트
 * 실행: node scripts/create_minji_account.js
 */

const SUPABASE_URL = 'https://kojdzbhewqjxdqfplqzj.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_xcU6M9N080AEilbf3MHLCg_KD17CX8M';

async function createMinjiAccount() {
  console.log('👤 강민지 계정 생성 시작...\n');

  try {
    // 1. auth.users에 계정 생성
    const createUserResponse = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'mj.kang@rtb-kor.com',
          password: '123123',
          email_confirm: true,
          user_metadata: {
            name: '강민지',
            username: 'mj.kang',
          },
        }),
      }
    );

    let userId;
    
    if (!createUserResponse.ok) {
      const errorText = await createUserResponse.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText };
      }
      
      // 이미 계정이 존재하는 경우, 이메일로 사용자 찾기
      if (error.error_code === 'email_exists' || error.message?.includes('already been registered')) {
        console.log('ℹ️  계정이 이미 존재합니다. 사용자 조회 중...');
        const getUserResponse = await fetch(
          `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent('mj.kang@rtb-kor.com')}`,
          {
            headers: {
              'apikey': SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
          }
        );
        
        if (!getUserResponse.ok) {
          console.error('❌ 사용자 조회 실패:', await getUserResponse.text());
          return;
        }
        
        const usersData = await getUserResponse.json();
        if (usersData.users && usersData.users.length > 0) {
          userId = usersData.users[0].id;
          console.log('✅ 기존 계정 찾음 - User ID:', userId);
        } else {
          console.error('❌ 사용자를 찾을 수 없습니다.');
          return;
        }
      } else {
        console.error('❌ 계정 생성 실패:', error.error?.message || error.message || errorText);
        return;
      }
    } else {
      const userData = await createUserResponse.json();
      userId = userData.id;
      console.log('✅ 계정 생성 완료 - User ID:', userId);
    }

    // 2. profiles 테이블에 추가/업데이트 (PATCH로 직접 업데이트)
    const profileResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          name: '강민지',
          username: 'mj.kang',
          email: 'mj.kang@rtb-kor.com',
          position: '인턴',
          phone_number: '010-9963-0772',
          address: '부산광역시 금강로 131번길 42 206동 1005호',
          birth_date: '2007-07-18',
          join_date: '2025-11-17',
          role: 'staff',
        }),
      }
    );

    if (!profileResponse.ok) {
      // 프로필이 없으면 INSERT
      const insertResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles`,
        {
          method: 'POST',
          headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            id: userId,
            name: '강민지',
            username: 'mj.kang',
            email: 'mj.kang@rtb-kor.com',
            position: '인턴',
            phone_number: '010-9963-0772',
            address: '부산광역시 금강로 131번길 42 206동 1005호',
            birth_date: '2007-07-18',
            join_date: '2025-11-17',
            role: 'staff',
          }),
        }
      );

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('❌ 프로필 추가 실패:', errorText);
        return;
      }
      console.log('✅ 프로필 추가 완료');
    } else {
      console.log('✅ 프로필 업데이트 완료');
    }

    // 3. profile_passports에 추가/업데이트 (upsert)
    const passportResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/profile_passports`,
      {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation,resolution=merge-duplicates',
        },
        body: JSON.stringify({
          user_id: userId,
          passport_last_name: 'KANG',
          passport_first_name: 'MINJI',
          passport_number: null,
          passport_expiry_date: null,
        }),
      }
    );

    if (!passportResponse.ok) {
      // 이미 존재하면 PATCH
      const patchPassportResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/profile_passports?user_id=eq.${userId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            passport_last_name: 'KANG',
            passport_first_name: 'MINJI',
            passport_number: null,
            passport_expiry_date: null,
          }),
        }
      );

      if (!patchPassportResponse.ok) {
        console.warn('⚠️  여권정보 업데이트 실패 (무시 가능)');
      } else {
        console.log('✅ 여권정보 업데이트 완료');
      }
    } else {
      console.log('✅ 여권정보 추가 완료');
    }

    console.log('\n✨ 강민지 계정 생성 완료!');
    console.log('📧 이메일: mj.kang@rtb-kor.com');
    console.log('🔑 비밀번호: 123123');
    console.log('👤 User ID:', userId);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

createMinjiAccount();

