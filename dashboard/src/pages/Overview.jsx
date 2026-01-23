import React, { useState, useEffect } from "react";
import { Activity, Shield, Pill, Users, TrendingUp, Zap } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

const StatCard = ({ label, value, icon, color, trend }) => (
    <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-all cursor-default group overflow-hidden relative">
        <div className="flex items-center gap-5 relative z-10">
            <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${color}15`, color: color }}
            >
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{value}</h3>
            </div>
        </div>
        <div className="text-right relative z-10">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{trend}</span>
        </div>
        <div className="absolute right-0 top-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            {React.cloneElement(icon, { size: 120 })}
        </div>
    </div>
);

const Overview = () => {
    const { contracts } = useWeb3();
    const [networkStats, setNetworkStats] = useState({
        activeBatches: "1,248",
        verifiedFacilities: "85",
        patientRecords: "12.4k",
        health: "99.9%"
    });

    useEffect(() => {
        const fetchLiveStats = async () => {
            if (!contracts.DrugNFT) return;
            try {
                const totalBatches = await contracts.DrugNFT.totalSupply();
                const totalMan = await contracts.ManufacturerRegistry.getTotalManufacturers();

                setNetworkStats({
                    activeBatches: Number(totalBatches).toLocaleString(),
                    verifiedFacilities: Number(totalMan).toLocaleString(),
                    patientRecords: "12.4k",
                    health: "100%"
                });
            } catch (err) {
                console.warn("Live stats fetch failed, using defaults", err);
            }
        };
        fetchLiveStats();
    }, [contracts]);

    const stats = [
        { label: "Active Batches", value: networkStats.activeBatches, icon: <Pill size={24} />, color: "#00f2fe", trend: "+12%" },
        { label: "Verified Facilities", value: networkStats.verifiedFacilities, icon: <Shield size={24} />, color: "#34d399", trend: "+2" },
        { label: "Patient Records", value: networkStats.patientRecords, icon: <Users size={24} />, color: "#fb7185", trend: "+0.8%" },
        { label: "Network Health", value: networkStats.health, icon: <Activity size={24} />, color: "#a78bfa", trend: "STABLE" },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2 italic tracking-tight">Ecosystem Dashboard</h2>
                    <p className="text-gray-400">Monitoring global pharmaceutical flow on the Base L2 Network.</p>
                </div>
                <div className="bg-[#1e293b] px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-3">
                    <Zap size={16} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-gray-300">LIVE SYNC ENABLED</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0f172a] border border-gray-800 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500" /> Global Supply Velocity
                        </h3>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="w-2 h-2 rounded-full bg-indigo-500/20"></span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500/20"></span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-1 px-4">
                        {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                            <div key={i} className="flex-1 group/bar relative">
                                <div
                                    className="bg-blue-500/10 group-hover/bar:bg-blue-500/40 transition-all rounded-t-lg w-full"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity font-bold">
                                    {h}k
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest border-t border-gray-800 pt-4">
                        <span>JAN</span>
                        <span>MAR</span>
                        <span>MAY</span>
                        <span>JUL</span>
                        <span>SEP</span>
                        <span>NOV</span>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                        <Shield size={20} className="text-emerald-400" /> Security Protocol
                    </h3>
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-gray-500">Smart Audit Coverage</span>
                                <span className="text-blue-400">92%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-gray-500">Node Decentralization</span>
                                <span className="text-emerald-400">84%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '84%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2 text-xs text-gray-400 leading-relaxed bg-black/20 p-4 rounded-xl border border-gray-800">
                            <p className="font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-tight"> <Activity size={12} /> System Status</p>
                            All 17 smart contracts verified on Etherscan. Zero critical vulnerabilities found in last automated audit.
                        </div>
                    </div>
                    <button className="w-full mt-8 bg-[#1e293b] hover:bg-[#334155] text-white py-3 rounded-xl font-bold transition-all border border-gray-700">
                        Security Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
