import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useWeb3 } from "../context/Web3Context";

const Layout = ({ children }) => {
    const { role, loading } = useWeb3();

    if (loading) {
        return (
            <div className="h-screen w-full bg-[#0a0f18] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Initializing Secure Connection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0a0f18] overflow-hidden">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col relative">
                <Header />
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>

                {/* Dynamic Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Layout;
