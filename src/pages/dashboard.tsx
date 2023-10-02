import ProtectedRoute from "@/components/ProtectedRoute";
import Head from "next/head";

const DashboardPage = () => {
    return (
        <ProtectedRoute>
            <Head>
                <title>Admin Panel | PECFEST&apos;23</title>
            </Head>
            <div className="flex py-2 container mx-auto">
                <div className="text-gray-600 px-12 py-24 mt-24 overflow-y-hidden mx-auto">
                    <h2 className="text-2xl font-semibold">
                        You are logged in!
                    </h2>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default DashboardPage;
