import React, { useState, useEffect } from "react";
import { Plus, Package, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";

const ManufacturerDashboard = () => {
    const { contracts, account } = useWeb3();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minting, setMinting] = useState(false);
    const [showMintForm, setShowMintForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        batchId: "",
        manufacturerName: "",
        expiryDate: "",
        ipfsHash: "Qm..." // Placeholder
    });

    /**
     * @dev Fetches production batches for the manufacturer from the DrugNFT contract.
     * If contract interaction fails, falls back to mock data for demonstration.
     */
    const fetchBatches = async () => {
        if (!contracts.DrugNFT) return;
        try {
            setLoading(true);
            // In a real app, we'd query events or a subgraph. 
            // For this demo, we'll try to fetch some data or use mock if fails.
            const total = await contracts.DrugNFT.totalSupply();
            const fetchedBatches = [];
            for (let i = 1; i <= Math.min(Number(total), 5); i++) {
                const details = await contracts.DrugNFT.getBatchDetails(i);
                fetchedBatches.push({
                    id: i,
                    batchId: details[0],
                    manufacturer: details[1],
                    expiryDate: new Date(Number(details[2]) * 1000).toLocaleDateString(),
                    isRecalled: !await contracts.DrugNFT.isValid(i),
                    timestamp: Number(details[2]) // Simplified
                });
            }
            setBatches(fetchedBatches);
        } catch (err) {
            console.warn("Failed to fetch real batches, using mock data for demo", err);
            setBatches([
                { id: 101, batchId: "B-2023-X92", manufacturer: "Pfizer Global", expiryDate: "12/20/2026", isRecalled: false, timestamp: Date.now() / 1000 },
                { id: 102, batchId: "B-2023-Z44", manufacturer: "Pfizer Global", expiryDate: "10/15/2025", isRecalled: true, timestamp: Date.now() / 1000 - 86400 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, [contracts]);

    /**
     * @dev Handles the minting of a new pharmaceutical batch.
     * Interacts with the DrugNFT contract to create a new token representing the batch.
     * @param {Event} e - Form submission event.
     */
    const handleMint = async (e) => {
        e.preventDefault();
        if (!contracts.DrugNFT) return;

        try {
            setMinting(true);
            const expiryTimestamp = Math.floor(new Date(formData.expiryDate).getTime() / 1000);

            // Using the DrugNFT contract to mint a new batch
            const tx = await contracts.DrugNFT.mintBatch(
                formData.batchId,
                formData.manufacturerName,
                expiryTimestamp,
                formData.ipfsHash
            );

            console.log("Transaction sent:", tx.hash);
            await tx.wait();

            // Refresh the batch list after successful minting
            await fetchBatches();

            // Reset form and show success
            setShowMintForm(false);
            setFormData({
                batchId: "",
                manufacturerName: "",
                expiryDate: "",
                ipfsHash: "Qm..."
            });

            alert(`Batch ${formData.batchId} Minted Successfully!`);
        } catch (err) {
            console.error("Minting failed", err);
            alert("Error: " + (err.reason || err.message));
        } finally {
            setMinting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Manufacturer Hub</h2>
                    <p className="text-gray-400">Manage your pharmaceutical production and batch lifecycle.</p>
                </div>
                <button
                    onClick={() => setShowMintForm(!showMintForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                    {showMintForm ? "Cancel" : <><Plus size={20} /> Mint New Batch</>}
                </button>
            </div>

            {showMintForm && (
                <div className="bg-[#0f172a] border border-blue-500/30 rounded-2xl p-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Package className="text-blue-400" /> New Batch Details
                    </h3>
                    <form onSubmit={handleMint} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Internal Batch ID</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. BTC-9923-Z"
                                value={formData.batchId}
                                onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Manufacturer Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Full Pharmacy/Org Name"
                                value={formData.manufacturerName}
                                onChange={e => setFormData({ ...formData, manufacturerName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Expiry Date</label>
                            <input
                                required
                                type="date"
                                value={formData.expiryDate}
                                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">IPFS Documentation (CID)</label>
                            <input
                                type="text"
                                placeholder="Qm..."
                                value={formData.ipfsHash}
                                onChange={e => setFormData({ ...formData, ipfsHash: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={minting}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                {minting ? <><Loader2 className="animate-spin" /> Minting...</> : "Authorize & Mint Batch"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 cursor-default">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Batches</p>
                            <h4 className="text-2xl font-bold text-white">{batches.length}</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "65%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 cursor-default">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Active Units</p>
                            <h4 className="text-2xl font-bold text-white">1.2M</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "82%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 cursor-default">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Pending QC</p>
                            <h4 className="text-2xl font-bold text-white">5</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "40%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 cursor-default">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Recalled</p>
                            <h4 className="text-2xl font-bold text-white">
                                {batches.filter(b => b.isRecalled).length}
                            </h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: "15%" }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1e293b]/30">
                        <h3 className="text-lg font-bold text-white">Your Production Batches</h3>
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-800 rounded text-gray-400 uppercase">Recent 5</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4">Batch ID</th>
                                    <th className="px-6 py-4">Expiry</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            <Loader2 className="animate-spin mx-auto mb-2" /> Loading batches...
                                        </td>
                                    </tr>
                                ) : batches.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            No batches found. Start by minting one.
                                        </td>
                                    </tr>
                                ) : (
                                    batches.map((batch) => (
                                        <tr key={batch.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                        <Package size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{batch.batchId}</p>
                                                        <p className="text-[10px] text-gray-500 font-mono">Token #{batch.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm font-medium">{batch.expiryDate}</td>
                                            <td className="px-6 py-4">
                                                {batch.isRecalled ? (
                                                    <span className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2 py-1 rounded-full text-xs font-bold w-fit border border-red-500/20">
                                                        <AlertTriangle size={12} /> RECALLED
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-xs font-bold w-fit border border-emerald-500/20">
                                                        <CheckCircle size={12} /> VALID
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-gray-400 hover:text-white text-sm font-medium underline underline-offset-4">
                                                    View Trail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20">
                        <h3 className="text-xl font-bold mb-2">Compliance Score</h3>
                        <p className="text-blue-100 text-sm mb-6">Your facility's trust rating based on {batches.length + 22} successful shipments.</p>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-4xl font-black">98.2</span>
                            <span className="text-blue-200 text-sm">+2.4% vs last mo</span>
                        </div>
                        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                            <div className="bg-white h-full" style={{ width: "98.2%" }}></div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-gray-400" /> Production Log
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: "Batch Verification", time: "1h ago", desc: "Batch #B229 verified" },
                                { label: "New Mint", time: "3h ago", desc: "Successfully minted 50k units" },
                                { label: "Quality Check", time: "Yesterday", desc: "Passed QC Level 3" },
                            ].map((log, i) => (
                                <div key={i} className="pl-4 border-l-2 border-gray-800 space-y-1">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{log.label} • {log.time}</p>
                                    <p className="text-sm text-gray-300">{log.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManufacturerDashboard;
