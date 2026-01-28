import React, { useState, useEffect } from "react";
import { User, Wallet, Pill, History, ShieldCheck, Coins, RefreshCcw, Calendar, Search, Loader2, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { ethers } from "ethers";

const PatientDashboard = () => {
    const { contracts, account } = useWeb3();
    const [balance, setBalance] = useState("0");
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [batchId, setBatchId] = useState("");
    const [verificationResult, setVerificationResult] = useState(null);

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

    const verifyMedication = async (e) => {
        e.preventDefault();
        if (!batchId) return;

        try {
            setVerifying(true);
            setVerificationResult(null);

            // Simulate blockchain verification delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            setVerificationResult({
                isValid: true,
                manufacturer: "Pfizer Global",
                expiry: "12/20/2026",
                origin: "Brussels, Belgium"
            });
        } catch (err) {
            console.error("Verification failed", err);
            alert("Verification error. Please try again.");
        } finally {
            setVerifying(false);
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
                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group/stat">
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

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all cursor-pointer group/stat">
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

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all cursor-pointer group/stat">
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

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-rose-500/50 transition-all cursor-pointer group/stat">
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

            <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden group">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Medication Authenticity Scanner</h3>
                    </div>
                    <p className="text-gray-400 max-w-lg">Verify your medication by entering the batch ID from the packaging. We'll cross-reference the data with the manufacturer's on-chain records.</p>
                </div>

                <div className="w-full md:w-96 space-y-4 bg-[#1e293b]/50 p-6 rounded-2xl border border-gray-700/50">
                    <form onSubmit={verifyMedication} className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Batch ID (e.g. B-2023-X92)"
                                className="w-full bg-[#0f172a] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                                value={batchId}
                                onChange={e => setBatchId(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={verifying}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {verifying ? <><Loader2 className="animate-spin" size={18} /> Verifying...</> : "Scan & Verify"}
                        </button>
                    </form>

                    {verificationResult && (
                        <div className="mt-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 animate-fade-in">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                                <CheckCircle size={14} /> Product Verified
                            </div>
                            <div className="space-y-1 text-xs">
                                <p className="text-white"><span className="text-gray-500">Manufacturer:</span> {verificationResult.manufacturer}</p>
                                <p className="text-white"><span className="text-gray-500">Expiry:</span> {verificationResult.expiry}</p>
                                <p className="text-white"><span className="text-gray-500">Source:</span> {verificationResult.origin}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-xl">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-rose-400" /> Health Alerts
                    </h4>
                    <div className="space-y-3">
                        <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                                <Clock size={16} />
                            </div>
                            <div>
                                <p className="text-white text-xs font-bold">Refill Due Soon</p>
                                <p className="text-[10px] text-gray-500">Amoxicillin 500mg (Batch B-2023-X92) expires in 5 days.</p>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                <ShieldCheck size={16} />
                            </div>
                            <div>
                                <p className="text-white text-xs font-bold">Network Verification</p>
                                <p className="text-[10px] text-gray-500">Your Doctor credentials have been verified for Q2 2024.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-xl text-white">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Coins size={18} className="text-[#fb7185]" /> Rewards Activity
                    </h4>
                    <div className="space-y-4">
                        {[
                            { label: "Adherence Bonus", amount: "+50 RPH", date: "Jan 22" },
                            { label: "Verification Reward", amount: "+10 RPH", date: "Jan 18" },
                            { label: "Facility Feedback", amount: "+25 RPH", date: "Jan 10" },
                        ].map((log, i) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                                <div>
                                    <p className="font-bold">{log.label}</p>
                                    <p className="text-[10px] text-gray-500 tracking-wider font-mono">{log.date}</p>
                                </div>
                                <span className="text-[#fb7185] font-black">{log.amount}</span>
                            </div>
                        ))}
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
                            <div key={rx.id} className="bg-[#1e293b] border border-gray-700/50 p-6 rounded-2xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
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
                                <div className="space-y-4 pt-4 border-t border-gray-800/50">
                                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                                        <span className="flex items-center gap-1"><ShieldCheck size={12} /> NFT # {rx.id}</span>
                                        <span>ISSUED: {rx.date}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => alert(`Refill requested for ${rx.drug}. Your doctor has been notified.`)}
                                            className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                                        >
                                            Request Refill
                                        </button>
                                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded-lg text-[10px] font-bold transition-all">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
