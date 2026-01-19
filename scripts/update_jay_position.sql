-- 김지연 직급을 '대리'에서 '과장'으로 업데이트
-- Supabase SQL Editor에서 실행하세요

UPDATE profiles
SET position = '과장'
WHERE name = '김지연' AND position = '대리';

-- 결과 확인
SELECT 
    name,
    username,
    position,
    join_date
FROM profiles
WHERE name = '김지연';

