// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ 환경 변수가 설정되지 않았습니다!");
    console.error("다음 단계를 따라주세요:");
    console.error("1. 프로젝트 루트에 .env 파일을 생성하세요");
    console.error("2. 다음 내용을 추가하세요:");
    console.error("   VITE_SUPABASE_URL=your_supabase_url");
    console.error("   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key");
    console.error("3. 개발 서버를 재시작하세요 (npm run dev)");
    throw new Error(
        "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env"
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
    global: {
        headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
        },
    },
});
