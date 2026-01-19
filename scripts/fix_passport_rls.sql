-- profile_passports 테이블의 RLS 정책 수정
-- 모든 사용자가 모든 여권정보를 볼 수 있도록 설정

-- 기존 RLS 정책 확인 (선택적)
-- SELECT * FROM pg_policies WHERE tablename = 'profile_passports';

-- 기존 SELECT 정책 삭제 (있다면)
DROP POLICY IF EXISTS "profile_passports_select_own" ON profile_passports;
DROP POLICY IF EXISTS "profile_passports_select_admin" ON profile_passports;
DROP POLICY IF EXISTS "profile_passports_select_all" ON profile_passports;

-- 모든 authenticated 사용자가 모든 여권정보를 볼 수 있는 정책 생성
CREATE POLICY "profile_passports_select_all"
ON profile_passports
FOR SELECT
TO authenticated
USING (true);

-- 참고: INSERT, UPDATE, DELETE는 기존 정책 유지하거나 필요에 따라 수정
-- 예: 본인 것만 수정/삭제 가능하게 하려면
-- CREATE POLICY "profile_passports_update_own"
-- ON profile_passports
-- FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);

