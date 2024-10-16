import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import Footer from "@/components/footer/Footer";
import { SidebarProvider } from "@/components/sidebar/SidebarContext";

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

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    const isAuthorized = true; // This should be determined by your auth logic

    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
            <div className="min-h-screen">
                <Sidebar isAuthorized={isAuthorized} />
                <main className="min-h-screen flex flex-col">
                    <div className={"flex-grow"}>
                        {children}
                    </div>
                    <Footer />
                </main>
            </div>
        </SidebarProvider>
        </body>
        </html>
    );
}