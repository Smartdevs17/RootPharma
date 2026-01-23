import React from "react";
import { Wallet, ShieldCheck } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useWeb3 } from "../context/Web3Context";

const Layout = ({ children }) => {
    const { role, loading, account, connectWallet } = useWeb3();

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

    if (!account) {
        return (
            <div className="h-screen w-full bg-[#0a0f18] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>

                <div className="text-center space-y-8 max-w-2xl px-6 animate-fade-in">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mx-auto transform rotate-12">
                        <ShieldCheck className="text-white" size={48} />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tight mb-4 leading-tight">Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">RootPharma</span></h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Empowering the pharmaceutical world with a decentralized, immutable, and transparent supply chain system.
                        </p>
                    </div>

                    <button
                        onClick={connectWallet}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-blue-500/30 flex items-center gap-3 mx-auto transform hover:scale-105 active:scale-95"
                    >
                        <Wallet size={24} />
                        Initialize Authorization
                    </button>

                    <div className="pt-12 grid grid-cols-3 gap-8 text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                        <p className="hover:text-blue-400 transition-colors">Transparent</p>
                        <p className="hover:text-emerald-400 transition-colors">Immutable</p>
                        <p className="hover:text-indigo-400 transition-colors">Verified</p>
                    </div>
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
