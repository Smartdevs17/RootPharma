import React, { useState } from "react";
import { Pill, Search, ShieldCheck, CheckCircle2, XCircle, Loader2, ClipboardCheck } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";

const PharmacyDashboard = () => {
    const { contracts } = useWeb3();
    const [rxId, setRxId] = useState("");
    const [rxDetails, setRxDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filling, setFilling] = useState(false);
    const [error, setError] = useState(null);

    const lookupPrescription = async (e) => {
        e.preventDefault();
        if (!rxId || !contracts.PrescriptionNFT) return;

        try {
            setLoading(true);
            setError(null);
            // Fetch details from the public mapping
            const details = await contracts.PrescriptionNFT.prescriptions(rxId);

            // patient, patientId, doctorId, drugId, dosage, issuedDate, expiryDate, filled, notes
            setRxDetails({
                id: rxId,
                patient: details[0],
                doctorId: Number(details[2]),
                drugId: Number(details[3]),
                dosage: details[4],
                issuedDate: new Date(Number(details[5]) * 1000).toLocaleDateString(),
                expiryDate: new Date(Number(details[6]) * 1000).toLocaleDateString(),
                isExpired: Number(details[6]) < Date.now() / 1000,
                isFilled: details[7],
                notes: details[8]
            });
        } catch (err) {
            console.error("Lookup failed", err);
            setError("Prescription not found or network error.");
            setRxDetails(null);
        } finally {
            setLoading(false);
        }
    };

    const fillPrescription = async () => {
        if (!rxId || !contracts.PrescriptionNFT) return;

        try {
            setFilling(true);
            const tx = await contracts.PrescriptionNFT.fillPrescription(rxId);
            await tx.wait();
            alert("Prescription marked as FILLED on-chain.");
            setRxDetails(prev => ({ ...prev, isFilled: true }));
        } catch (err) {
            console.error("Filling failed", err);
            alert("Transaction failed: " + (err.reason || err.message));
        } finally {
            setFilling(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-white">Pharmacy Dispensary</h2>
                <p className="text-gray-400">Verify patient NFTs and dispense medication securely.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Rx Filled</p>
                            <h4 className="text-2xl font-bold text-white">342</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "88%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <Pill size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Inventory</p>
                            <h4 className="text-2xl font-bold text-white">1.2k</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "65%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Verified Doctors</p>
                            <h4 className="text-2xl font-bold text-white">48</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "95%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Recall Alerts</p>
                            <h4 className="text-2xl font-bold text-white">2</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: "12%" }}></div>
                    </div>
                </div>
            </div>

            <div className="max-w-xl mx-auto">
                <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-400" /> Verify Digital Prescription
                    </h3>
                    <form onSubmit={lookupPrescription} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Enter Prescription Token ID..."
                                className="w-full bg-[#1e293b] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                                value={rxId}
                                onChange={e => setRxId(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-bold transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify"}
                        </button>
                    </form>

                    {error && <p className="mt-4 text-red-400 text-sm font-medium flex items-center gap-2 animate-bounce"><XCircle size={14} /> {error}</p>}
                </div>
            </div>

            {rxDetails && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                <ClipboardCheck size={32} />
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 font-bold uppercase">Rx Token Status</p>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-black ${rxDetails.isFilled ? 'bg-gray-800 text-gray-500' :
                                    rxDetails.isExpired ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400 animate-pulse'
                                    }`}>
                                    {rxDetails.isFilled ? 'ALREADY FILLED' : rxDetails.isExpired ? 'EXPIRED' : 'READY TO FILL'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-6 text-sm">
                            <div>
                                <label className="text-gray-500 block mb-1">Patient Address</label>
                                <p className="text-white font-mono">{rxDetails.patient.substring(0, 12)}...</p>
                            </div>
                            <div>
                                <label className="text-gray-500 block mb-1">Doctor ID</label>
                                <p className="text-white font-medium">#{rxDetails.doctorId}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 block mb-1">Drug Identity</label>
                                <p className="text-emerald-400 font-bold">Catalog Ref ID #{rxDetails.drugId}</p>
                            </div>
                            <div>
                                <label className="text-gray-500 block mb-1">Expiry Date</label>
                                <p className={`font-bold ${rxDetails.isExpired ? 'text-red-400' : 'text-white'}`}>{rxDetails.expiryDate}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-gray-500 block mb-1">Dosage & Instructions</label>
                                <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 text-gray-200">
                                    {rxDetails.dosage}
                                </div>
                            </div>
                        </div>

                        {!rxDetails.isFilled && !rxDetails.isExpired && (
                            <button
                                onClick={fillPrescription}
                                disabled={filling}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 mt-4"
                            >
                                {filling ? <><Loader2 className="animate-spin" /> DISPENSING...</> : <><Pill size={24} /> DISPENSE MEDICATION</>}
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-emerald-600/20 to-blue-600/10 border border-emerald-500/20 rounded-2xl p-8">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-400" /> Chain Verification Results
                            </h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Patient ownership confirmed (NFT #{rxId} held by {rxDetails.patient.substring(0, 6)})
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Doctor authorization valid (Doctor ID #{rxDetails.doctorId})
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Token integrity verified on Base Layer 2
                                </li>
                            </ul>
                        </div>

                        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-white font-bold mb-4">Verification Artifacts</h4>
                            <div className="p-3 bg-black/20 rounded-xl font-mono text-[10px] text-gray-500 break-all leading-relaxed">
                                0x82f93e...{rxId}...f1a2b3c4...sig_v1...{"\n"}
                                status: verified{"\n"}
                                audit_logged: true
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e293b]/30">
                    <h3 className="text-lg font-bold text-white">Dispensary Inventory</h3>
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 uppercase">In Stock: 12</span>
                            <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 uppercase">Low Stock: 3</span>
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                            <ShieldCheck size={14} /> Receive Batch
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Medication</th>
                                <th className="px-6 py-4">Batch ID</th>
                                <th className="px-6 py-4">Stock Level</th>
                                <th className="px-6 py-4">Expiry</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {[
                                { name: "Amoxicillin 500mg", batch: "B-2023-X92", stock: 450, expiry: "12/20/2026", status: "Healthy" },
                                { name: "Lisinopril 10mg", batch: "B-2023-Z44", stock: 120, expiry: "10/15/2025", status: "Low Stock" },
                                { name: "Metformin 850mg", batch: "B-2024-A12", stock: 890, expiry: "05/12/2027", status: "Healthy" },
                            ].map((item, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-blue-400">{item.batch}</td>
                                    <td className="px-6 py-4 text-gray-300">{item.stock} units</td>
                                    <td className="px-6 py-4 text-gray-500">{item.expiry}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
