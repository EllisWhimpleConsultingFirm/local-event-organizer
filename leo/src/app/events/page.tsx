// export default function Events() {
//     return (
//         <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//             <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//             <h1>Events Page</h1>
//                 {/* Add vendor management interface here */}
//             </main>
//         </div>
//     )
// }



import {createClient} from "@/utils/supabase/server";

export default async function Notes() {
    const supabase = createClient();
    const { data: notes } = await supabase.from("Events").select();

    return <pre>{JSON.stringify(notes, null, 2)}</pre>
}