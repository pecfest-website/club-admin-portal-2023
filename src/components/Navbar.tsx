import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@mui/material";

const Navbar = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const handleLogout = async () => {
        try {
            await signOut({callbackUrl: '/'});
            router.push("/login");
        } catch (error: any) {
            console.log(error.message);
        }
    };
    return (
        <>
            <header className="flex flex-wrap container mx-auto max-w-full items-center px-6 justify-between bg-transparent absolute top-0 z-50">
                <div className="flex items-center text-white hover:text-orange-400 cursor-pointer transition duration-150 ">
                    <Link href="/">
                        <Image
                            src={"/logo.png"}
                            alt="Pecfest"
                            height={100}
                            width={100}
                        />
                    </Link>
                </div>

                <nav
                    className={`md:flex md:items-center font-title w-full md:w-auto`}
                >
                    <ul className="text-lg inline-block">
                        {!session?.user ? null : (
                            <>
                                <li className="my-3 md:my-0 items-center mr-4 md:inline-block block ">
                                    <button
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default Navbar;
