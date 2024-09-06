import {createBrowserClient} from '@supabase/ssr';
import {Database} from "../Definitions/generatedDefinitions.ts";
import {SupabaseClient} from "@supabase/supabase-js";
import invariant from 'tiny-invariant';


let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export class Client {
    private client: ReturnType<typeof createBrowserClient<Database>> | undefined;

    constructor() {}

    public getClient (): SupabaseClient {
        if (client) {
            return client;
        }

        invariant(import.meta.env.API_KEY, `Supabase URL was not provided`);
        invariant(import.meta.env.URL, `Supabase Anon key was not provided`);

        client = createBrowserClient<Database>(
            import.meta.env.API_KEY,
            import.meta.env.URL
        );

        return client;
    }
}