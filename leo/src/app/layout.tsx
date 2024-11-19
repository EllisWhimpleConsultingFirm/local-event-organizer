import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import Footer from "@/components/footer/footer";
import { SidebarProvider } from "@/components/sidebar/sidebarContext";
import {createClient} from "@/utils/supabase/server";
import {Providers} from "@/providers";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Leo",
    description: "Local Event Organizer",
};

export default async function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    let isLoggedIn = false
    const supabase = await createClient()
    const {data, error} = await supabase.auth.getUser()
    if (!(error || !data?.user)) {
        isLoggedIn = true
    }


    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
            <div className="min-h-screen">
                <Sidebar isLoggedIn={isLoggedIn} />
                <main className="min-h-screen flex flex-col">
                    <div className={"flex-grow"}>
                        {children}
                    </div>
                    <Footer/>
                </main>
            </div>
        </Providers>
        </body>
        </html>
    );
}