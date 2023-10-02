import React, { ReactNode } from "react";
import Navbar from "./Navbar";

function Layout({ children }: { children: ReactNode }) {
    return (
        <main className="h-screen w-screen overflow-hidden">
            <Navbar />
            {children}
        </main>
    );
}

export default Layout;
