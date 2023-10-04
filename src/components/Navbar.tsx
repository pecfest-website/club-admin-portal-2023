import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const router = useRouter();

    const menuItems = [
        {
            id: 1,
            name: "Home",
            link: "/",
        },
        {
            id: 2,
            name: "Login",
            link: "/login",
        },
    ];

    const handleLogout = async () => {
        try {
            await logOut();
            router.push("/login");
        } catch (error: any) {
            console.log(error.message);
        }
    };
    return (
        <>
            <header className="flex flex-wrap container mx-auto max-w-full items-center px-6 justify-between bg-transparent  absolute top-0 z-50">
                <div className="flex items-center text-blue-900 hover:text-blue-800 cursor-pointer transition duration-150 ">
                    <Link href="/">
                        <Image src={"/logo.png"} alt="Pecfest" height={100} width={100}/>
                    </Link>
                </div>

                <nav
                    className={`md:flex md:items-center font-title w-full md:w-auto`}
                >
                    <ul className="text-lg inline-block">
                        <>
                            {!user.uid ? (
                                menuItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="my-3 md:my-0 items-center mr-4 md:inline-block block "
                                    >
                                        <Link href={item?.link}>
                                            <p className="text-blue-800 hover:text-blue-900 transition">
                                                {item?.name}
                                            </p>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li className="my-3 md:my-0 items-center mr-4 md:inline-block block ">
                                        <Link href="/dashboard">
                                            <p className="text-white transition">
                                                Dashboard
                                            </p>
                                        </Link>
                                    </li>
                                    <li className="my-3 md:my-0 items-center mr-4 md:inline-block block ">
                                        <p
                                            onClick={handleLogout}
                                            className="text-white transition cursor-pointer"
                                        >
                                            Logout
                                        </p>
                                    </li>
                                </>
                            )}
                        </>
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default Navbar;