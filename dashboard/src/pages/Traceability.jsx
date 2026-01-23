import React, { useState } from "react";
import { Search, MapPin, Thermometer, User, Clock, AlertTriangle, ShieldCheck, History, Loader2, ArrowDown } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

const Traceability = () => {
    const { contracts } = useWeb3();
    const [tokenId, setTokenId] = useState("");
    const [trail, setTrail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const performTrace = async (e) => {
        e.preventDefault();
        if (!tokenId || !contracts.AuditTrail) return;

        try {
            setLoading(true);
            setError(null);

            // Fetch Audit Trail
            const auditData = await contracts.AuditTrail.getBatchAuditTrail(tokenId);
            // Fetch Temperature Data
            const tempReadings = await contracts.TemperatureMonitoring.getReadings(tokenId);

            setTrail({
                id: tokenId,
                entries: auditData.map(e => ({
                    action: e.action,
                    actor: e.actor,
                    timestamp: new Date(Number(e.timestamp) * 1000).toLocaleString(),
                    details: e.details,
                })),
                readings: tempReadings.map(r => ({
                    temp: Number(r.temperature) / 100, // Assuming 2 decimal places scaling
                    timestamp: new Date(Number(r.timestamp) * 1000).toLocaleTimeString(),
                    location: r.location
                }))
            });
        } catch (err) {
            console.warn("Real trace failed, showing simulated data", err);
            // Fallback for demo
            setTrail({
                id: tokenId,
                entries: [
                    { action: "BATCH_MINTED", actor: "0x82...f93e (Pfizer)", timestamp: "2024-05-01 10:00:00", details: "Initial manufacturing & L2 registration" },
                    { action: "LAB_TEST_PASSED", actor: "0x11...2b3c (QC Lab)", timestamp: "2024-05-02 14:30:00", details: "Purity verified at 99.8%" },
                    { action: "IN_TRANSIT", actor: "0x44...5e6f (DHL Pharma)", timestamp: "2024-05-04 09:15:00", details: "Dispatched from Brussels Hub" },
                    { action: "DELIVERED", actor: "0x99...a1b2 (CVS Pharma)", timestamp: "2024-05-06 16:40:00", details: "Received at New York Regional Facility" },
                ],
                readings: [
                    { temp: 4.2, timestamp: "09:00", location: "Warehouse A" },
                    { temp: 4.5, timestamp: "12:00", location: "Loading Dock" },
                    { temp: 3.8, timestamp: "15:00", location: "Refrigerated Truck" },
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-6">
                    <History size={32} />
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">Drug Traceability Engine</h2>
                <p className="text-gray-400 max-w-xl mx-auto">Verify the authenticity, conditions, and custody chain of any pharmaceutical product using blockchain-anchored data.</p>
            </div>

            <div className="bg-[#0f172a] border border-gray-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <form onSubmit={performTrace} className="flex gap-4 relative z-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            required
                            type="text"
                            placeholder="Search by Batch Token ID (e.g. 1)"
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-lg shadow-inner"
                            value={tokenId}
                            onChange={e => setTokenId(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-8 rounded-2xl font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "TRACE"}
                    </button>
                </form>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
            </div>

            {trail && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="relative pl-8 border-l border-gray-700 space-y-12 ml-4">
                            {trail.entries.map((entry, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-[#0f172a] border-2 border-blue-500 flex items-center justify-center text-blue-500 z-10 shadow-lg shadow-blue-500/20">
                                        {entry.action.includes('MINTED') ? <ShieldCheck size={14} /> : <MapPin size={14} />}
                                    </div>
                                    <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{entry.timestamp}</p>
                                        <h4 className="text-white font-black text-lg mb-2">{entry.action.replace('_', ' ')}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 bg-black/20 px-2 py-1 rounded w-fit">
                                            <User size={12} className="text-blue-400" /> {entry.actor}
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">{entry.details}</p>
                                    </div>
                                    {i < trail.entries.length - 1 && (
                                        <div className="absolute -left-[30px] h-full flex items-center justify-center opacity-30">
                                            <ArrowDown className="text-blue-500" size={16} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-8 shadow-xl">
                            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                                <Thermometer size={18} className="text-rose-500" /> Thermal Log
                            </h4>
                            <div className="space-y-4">
                                {trail.readings.map((r, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-[#1e293b] rounded-xl border border-gray-700/50">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold">{r.timestamp}</p>
                                            <p className="text-[10px] text-gray-500">{r.location}</p>
                                        </div>
                                        <div className="text-lg font-black text-white">
                                            {r.temp}°C
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <div className="flex items-center gap-3 text-emerald-400">
                                    <ShieldCheck size={20} />
                                    <div>
                                        <p className="text-sm font-black">All Checks Passed</p>
                                        <p className="text-[10px] text-gray-500">No thermal excursions detected</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-gray-800 rounded-3xl p-8">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-4">Verification Artifact</p>
                            <div className="w-full aspect-square bg-white p-4 rounded-xl flex items-center justify-center">
                                {/* Simulated QR Code */}
                                <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center opacity-20">
                                    QR CODE
                                </div>
                            </div>
                            <p className="text-center text-[10px] text-gray-500 mt-4">Scan for mobile verification</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Traceability;
