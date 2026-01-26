import React, { useState, useEffect } from "react";
import { User, Wallet, Pill, History, ShieldCheck, Coins, RefreshCcw } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { ethers } from "ethers";

const PatientDashboard = () => {
    const { contracts, account } = useWeb3();
    const [balance, setBalance] = useState("0");
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!contracts.RewardToken || !account) return;

        try {
            setLoading(true);
            // Fetch Reward Balance
            const bal = await contracts.RewardToken.balanceOf(account);
            setBalance(ethers.formatEther(bal));

            // Mocking prescriptions for now
            setPrescriptions([
                { id: 1001, drug: "Amoxicillin 500mg", doctor: "Dr. Smith", date: "May 10, 2024", status: "Active" },
                { id: 982, drug: "Ibuprofen 400mg", doctor: "Dr. Jones", date: "Apr 15, 2024", status: "Filled" },
            ]);
        } catch (err) {
            console.error("Failed to fetch patient data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [contracts, account]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Patient Health Portfolio</h2>
                    <p className="text-gray-400">Your secure, decentralized medical records and rewards.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <RefreshCcw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Adherence</p>
                            <h4 className="text-2xl font-bold text-white">98%</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "98%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Next Checkup</p>
                            <h4 className="text-2xl font-bold text-white">2 Days</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "20%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <History size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Past Records</p>
                            <h4 className="text-2xl font-bold text-white">24</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: "100%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                            <Pill size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Medications</p>
                            <h4 className="text-2xl font-bold text-white">3 Active</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: "45%" }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-gray-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                        <h3 className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-2">
                            <Wallet size={14} className="text-blue-400" /> Digital Health Passport
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl">
                                <User size={40} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">{account ? `${account.substring(0, 10)}...` : 'Not Connected'}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-blue-400 font-bold text-xs uppercase bg-blue-400/10 px-2 py-0.5 rounded">Verified Patient</span>
                                    <span className="text-gray-500 text-xs font-medium uppercase">ID: #92834</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-10 relative z-10">
                        <div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Blood Type</p>
                            <p className="text-white font-bold text-lg">O Positive</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Active Rx</p>
                            <p className="text-white font-bold text-lg">1</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Network State</p>
                            <p className="text-emerald-400 font-bold text-lg flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Local
                            </p>
                        </div>
                    </div>

                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
                </div>

                <div className="bg-[#fb7185]/10 border border-[#fb7185]/20 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
                    <div>
                        <div className="w-12 h-12 bg-[#fb7185]/20 rounded-xl flex items-center justify-center text-[#fb7185] mb-6">
                            <Coins size={24} />
                        </div>
                        <h3 className="text-gray-200 font-bold text-lg mb-1">Reward Tokens</h3>
                        <p className="text-[#fb7185]/60 text-sm">Earned for adherence and feedback.</p>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">{parseFloat(balance).toFixed(0)}</span>
                            <span className="text-[#fb7185] font-bold">RPH</span>
                        </div>
                        <button className="w-full mt-6 bg-[#fb7185] hover:bg-[#e11d48] text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20">
                            Redeem for discounts
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e293b]/30">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <History size={18} className="text-gray-500" /> Prescriptions History
                    </h3>
                    <button className="text-xs text-blue-400 font-bold hover:underline">View All</button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {prescriptions.map((rx) => (
                            <div key={rx.id} className="bg-[#1e293b] border border-gray-700/50 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <Pill size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{rx.drug}</h4>
                                            <p className="text-xs text-gray-400">{rx.doctor}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black border ${rx.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-800 text-gray-500 border-gray-700'
                                        }`}>
                                        {rx.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-4 border-t border-gray-800/50">
                                    <span className="flex items-center gap-1"><ShieldCheck size={12} /> NFT # {rx.id}</span>
                                    <span>ISSUED: {rx.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
