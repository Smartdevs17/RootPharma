import React from "react";
import { Activity, Shield, Pill, Users } from "lucide-react";

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl flex items-center gap-5 hover:border-gray-700 transition-all cursor-default group">
        <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: `${color}15`, color: color }}
        >
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
    </div>
);

const Overview = () => {
    const stats = [
        { label: "Active Batches", value: "1,248", icon: <Pill size={24} />, color: "#00f2fe" },
        { label: "Verified Facilities", value: "85", icon: <Shield size={24} />, color: "#00ffcc" },
        { label: "Patient Records", value: "12.4k", icon: <Users size={24} />, color: "#fb7185" },
        { label: "Network Health", value: "99.9%", icon: <Activity size={24} />, color: "#a78bfa" },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            <section>
                <h2 className="text-3xl font-bold text-white mb-2">Network Overview</h2>
                <p className="text-gray-400">Holistic view of the RootPharma blockchain ecosystem.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0f172a] border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-800 last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">Batch #B8291439 verified by FDA Regulatory Compliance</p>
                                    <p className="text-gray-500 text-sm mt-1">2 mins ago • Transaction: 0x82...1a2b</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Network Health</h3>
                    <div className="space-y-8">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-400/10">
                                        Smart Contract Integrity
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-blue-400">
                                        100%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                                <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                            </div>
                        </div>
                        {/* More health indicators... */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
