import React from "react";
import { Wallet, Bell, Search, User } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

const Header = () => {
    const { account, role, connectWallet } = useWeb3();

    const formatAddress = (addr) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <header className="h-20 bg-[#0f172a] border-b border-gray-800 flex items-center justify-between px-8 text-white">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Batch ID, Rx ID, or Address..."
                        className="w-full bg-[#1e293b] border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-white transition-colors relative">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f172a]"></span>
                </button>

                {account ? (
                    <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                {role ? role.label : "Authorized User"}
                            </span>
                            <span className="text-sm font-semibold">{formatAddress(account)}</span>
                        </div>
                        <div
                            className="w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center bg-[#1e293b]"
                            style={{ borderColor: role ? role.color : "#64748b" }}
                        >
                            <User size={20} style={{ color: role ? role.color : "#fff" }} />
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={connectWallet}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Wallet size={18} />
                        Connect Wallet
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
