import Image from "next/image";
import { Inter } from "next/font/google";
import { Event } from "@/types/event";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            <Head>
                <title>Admin | PECFEST&apos;23</title>
            </Head>
        </main>
    );
}
