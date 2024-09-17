import {SupabaseClient} from "@supabase/supabase-js";
import {createServerClient} from "@supabase/ssr";
import {Database} from "../../shared/supabase";
import Cookies from 'js-cookie';

let client: ReturnType<typeof createServerClient<Database>> | undefined;

export function getClient(): SupabaseClient {
    if (client) {
        return client;
    }
    const apiKey = import.meta.env.VITE_API_KEY
    console.log(apiKey)
    const url = import.meta.env.VITE_URL
    console.log(url)
    client = createServerClient<Database>(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuam9pbmp0aXd0cm5wd2x2a2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2NTE4OTMsImV4cCI6MjA0MTIyNzg5M30.hUgx1cKHmiTIf4VozpKZimVBCeFC5AuDOzZVLuwtFCs",
        "https://rnjoinjtiwtrnpwlvkeu.supabase.co"
    );

    const cookieStore = Cookies
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    return client;
}
