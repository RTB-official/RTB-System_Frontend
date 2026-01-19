-- 알림 생성 RLS 정책 수정
-- Supabase SQL Editor에서 실행하세요

-- 기존 정책 완전히 삭제
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can create notifications for themselves" ON notifications;
DROP POLICY IF EXISTS "Allow authenticated insert" ON notifications;
DROP POLICY IF EXISTS "Allow all authenticated insert" ON notifications;

-- 방법 1: SECURITY DEFINER 함수 생성 (RLS 우회)
-- JSON 객체를 직접 반환하여 조회 불필요
-- 기존 함수가 있으면 먼저 삭제 (반환 타입 변경을 위해)
DROP FUNCTION IF EXISTS create_notification_for_user(UUID, TEXT, TEXT, TEXT);

CREATE FUNCTION create_notification_for_user(
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_notification JSON;
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (p_user_id, p_title, p_message, p_type)
    RETURNING json_build_object(
        'id', id,
        'user_id', user_id,
        'title', title,
        'message', message,
        'type', type,
        'is_read', is_read,
        'created_at', created_at
    ) INTO v_notification;
    
    RETURN v_notification;
END;
$$;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION create_notification_for_user TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification_for_user TO anon;

-- 방법 2: RLS 정책 재설정 (더 명확하게)
-- USING은 SELECT/UPDATE/DELETE용, WITH CHECK는 INSERT/UPDATE용
CREATE POLICY "Allow all authenticated insert"
    ON notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 정책이 제대로 적용되었는지 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'notifications'
ORDER BY policyname;

-- 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'notifications';

