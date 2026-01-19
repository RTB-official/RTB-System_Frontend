// 알림 테스트 스크립트
// node scripts/test_notification.js

const SUPABASE_URL = 'https://kojdzbhewqjxdqfplqzj.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_xcU6M9N080AEilbf3MHLCg_KD17CX8M';

async function testNotification() {
    console.log('🧪 알림 시스템 테스트 시작...\n');

    try {
        // 1. 공무팀 사용자 조회
        console.log('1️⃣ 공무팀 사용자 조회 중...');
        const gongmuResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles?department=eq.공무팀&select=id,name,username,department`,
            {
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                },
            }
        );

        if (!gongmuResponse.ok) {
            console.error('❌ 공무팀 사용자 조회 실패:', await gongmuResponse.text());
            return;
        }

        const gongmuUsers = await gongmuResponse.json();
        console.log(`✅ 공무팀 사용자 ${gongmuUsers.length}명 발견:`);
        gongmuUsers.forEach((u, i) => {
            console.log(`   ${i + 1}. ${u.name} (${u.username}) - ID: ${u.id}`);
        });

        if (gongmuUsers.length === 0) {
            console.error('❌ 공무팀 사용자가 없습니다! update_department_teams.sql을 실행했는지 확인하세요.');
            return;
        }

        // 2. notifications 테이블 존재 확인
        console.log('\n2️⃣ notifications 테이블 확인 중...');
        const tableCheckResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/notifications?limit=1`,
            {
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                },
            }
        );

        if (!tableCheckResponse.ok) {
            const errorText = await tableCheckResponse.text();
            if (errorText.includes('Could not find the table') || errorText.includes('does not exist')) {
                console.error('❌ notifications 테이블이 존재하지 않습니다!');
                console.error('   → scripts/create_notifications_table.sql을 Supabase SQL Editor에서 실행하세요.');
                return;
            }
            console.error('❌ 테이블 확인 실패:', errorText);
            return;
        }

        console.log('✅ notifications 테이블 존재 확인');

        // 3. 테스트 알림 생성
        console.log('\n3️⃣ 테스트 알림 생성 중...');
        const testNotifications = gongmuUsers.map((u) => ({
            user_id: u.id,
            title: '테스트 알림',
            message: '알림 시스템이 정상적으로 작동합니다!',
            type: 'other',
        }));

        const createResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/notifications`,
            {
                method: 'POST',
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation',
                },
                body: JSON.stringify(testNotifications),
            }
        );

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('❌ 알림 생성 실패:', errorText);
            
            // RLS 정책 문제일 수 있음
            if (errorText.includes('policy') || errorText.includes('RLS')) {
                console.error('\n⚠️ RLS 정책 문제일 수 있습니다.');
                console.error('   → scripts/create_notifications_table.sql의 RLS 정책을 확인하세요.');
            }
            return;
        }

        const created = await createResponse.json();
        console.log(`✅ 테스트 알림 ${created.length}개 생성 완료!`);

        // 4. 생성된 알림 확인
        console.log('\n4️⃣ 생성된 알림 확인 중...');
        const checkResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/notifications?user_id=eq.${gongmuUsers[0].id}&order=created_at.desc&limit=5`,
            {
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                },
            }
        );

        if (checkResponse.ok) {
            const notifications = await checkResponse.json();
            console.log(`✅ ${gongmuUsers[0].name}님의 최근 알림 ${notifications.length}개:`);
            notifications.forEach((n, i) => {
                console.log(`   ${i + 1}. [${n.type}] ${n.title}: ${n.message}`);
                console.log(`      생성일: ${n.created_at}`);
            });
        }

        console.log('\n✨ 알림 시스템 테스트 완료!');
        console.log('\n📝 다음 단계:');
        console.log('   1. 브라우저에서 로그인 후 알림 아이콘 클릭');
        console.log('   2. 테스트 알림이 보이는지 확인');
        console.log('   3. 보고서/일정/휴가 등록 시 알림이 생성되는지 확인');

    } catch (error) {
        console.error('❌ 테스트 중 오류:', error);
        process.exit(1);
    }
}

testNotification();

