import Image from "next/image";
import { Inter } from "next/font/google";
import { Event } from "@/types/event";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user.uid) {
            router.push("/dashboard");
        }
    }, [router, user]);
    return (
        <Layout>
            <div
                className={`flex flex-col items-center justify-center p-24 ${inter.className} h-full w-full bg-[url('/bg1.png')] bg-cover bg-opacity-10 bg-center`}
            >
                <Head>
                    <title>Admin | PECFEST&apos;23</title>
                </Head>
                <div className="space-y-10">
                    <h1 className="text-center text-4xl text-white font-bold font-serif">
                        PECFEST Admin Panel
                    </h1>
                    <div
                        className="border rounded-md px-6 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:bg-opacity-20"
                        onClick={() => router.push("/login")}
                    >
                        <p className="text-2xl text-white font-bold">
                            Login to continue!
                        </p>
                    </div>

                    <div className="text-white my-3 text-lg glassmorphism p-6 rounded-xl">
                        <p className="text-red-400 text-center font-bold">
                            Note: Open only in desktop
                        </p>
                        <p className="font-bold">
                            If you dont have login credentials, you may do the
                            following:
                        </p>
                        <ul className="list-disc">
                            <li>Close this tab</li>
                            <li>Ask someone to give you credentials</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
