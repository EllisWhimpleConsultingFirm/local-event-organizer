import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import {cookies} from "next/headers";
import Footer from "@/components/footer/Footer";

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

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = cookies();
    const isExpanded = cookieStore.get('sidebarExpanded')?.value === 'true';
    const isAuthorized = true;

    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
        <div className="flex flex-grow">
            <Sidebar isExpanded={isExpanded} isAuthorized={isAuthorized} />
            <div className="flex flex-col flex-grow">
                <main className="flex-grow p-4">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
        </body>
        </html>
    );
}
