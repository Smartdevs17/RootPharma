import React, { useState, useEffect } from "react";
import { Stethoscope, FilePlus, User, Pill, Calendar, Loader2, Search, Clock } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";

const DoctorDashboard = () => {
    const { contracts, account } = useWeb3();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [issuing, setIssuing] = useState(false);
    const [showIssueForm, setShowIssueForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        patientAddress: "",
        patientId: "",
        doctorId: "", // Should ideally be fetched from ManufacturerRegistry/DoctorRegistry
        drugId: "",
        dosage: "",
        expiryDate: "",
        notes: ""
    });

    /**
     * @dev Fetches internal prescription logs for the doctor.
     * In a real system, this would query a subgraph or the blockchain for indexed events.
     */
    const fetchPrescriptions = async () => {
        // Mocking for now as we don't have a direct "getDoctorPrescriptions" in the ABI I added
        // In production, we'd use indexed events
        setPrescriptions([
            { id: 1001, patient: "0x33...1a2b", drug: "Amoxicillin 500mg", date: "2024-05-10", status: "Active" },
            { id: 1002, patient: "0x82...f93e", drug: "Lisinopril 10mg", date: "2024-05-08", status: "Filled" },
        ]);
        setLoading(false);
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    /**
     * @dev Orchestrates the on-chain issuance of a new Prescription NFT.
     * Requires the caller to be a verified doctor on the registry.
     * @param {Event} e - Form submission event.
     */
    const handleIssue = async (e) => {
        e.preventDefault();
        if (!contracts.PrescriptionNFT) return;

        try {
            setIssuing(true);
            const expiryTimestamp = Math.floor(new Date(formData.expiryDate).getTime() / 1000);

            const tx = await contracts.PrescriptionNFT.issuePrescription(
                formData.patientAddress,
                parseInt(formData.patientId),
                parseInt(formData.doctorId),
                parseInt(formData.drugId),
                formData.dosage,
                expiryTimestamp,
                formData.notes
            );

            console.log("Prescription issuance tx sent:", tx.hash);
            await tx.wait();

            // Refresh prescriptions after issuance
            await fetchPrescriptions();

            // Reset form and UI state
            setShowIssueForm(false);
            setFormData({
                patientAddress: "",
                patientId: "",
                doctorId: "",
                drugId: "",
                dosage: "",
                expiryDate: "",
                notes: ""
            });

            alert("Prescription Issued Successfully!");
        } catch (err) {
            console.error("Issuance failed", err);
            alert("Error: " + (err.reason || err.message));
        } finally {
            setIssuing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Clinical Portal</h2>
                    <p className="text-gray-400">Secure electronic prescription management and patient verification.</p>
                </div>
                <button
                    onClick={() => setShowIssueForm(!showIssueForm)}
                    className="bg-[#a78bfa] hover:bg-[#8b5cf6] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-purple-500/20"
                >
                    {showIssueForm ? "Cancel" : <><FilePlus size={20} /> Issue New Rx</>}
                </button>
            </div>

            {showIssueForm && (
                <div className="bg-[#0f172a] border border-purple-500/30 rounded-2xl p-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Stethoscope className="text-purple-400" /> New Digital Prescription
                    </h3>
                    <form onSubmit={handleIssue} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Patient Wallet Address</label>
                            <input
                                required
                                type="text"
                                placeholder="0x..."
                                value={formData.patientAddress}
                                onChange={e => setFormData({ ...formData, patientAddress: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400">Patient ID</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="123"
                                    value={formData.patientId}
                                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Drug ID</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="88"
                                    value={formData.drugId}
                                    onChange={e => setFormData({ ...formData, drugId: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Dosage Instructions</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. 1 pill daily after meals"
                                value={formData.dosage}
                                onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400">Expiry Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Your Doctor ID</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="ID"
                                    value={formData.doctorId}
                                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-400">Clinical Notes (Encrypted on-chain)</label>
                            <textarea
                                rows="3"
                                placeholder="Any special instructions or diagnosis references..."
                                className="bg-[#1e293b] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 w-full"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={issuing}
                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                {issuing ? <><Loader2 className="animate-spin" /> Publishing...</> : "Sign & Issue Prescription"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <FilePlus size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Rx</p>
                            <h4 className="text-2xl font-bold text-white">842</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: "75%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Fill Rate</p>
                            <h4 className="text-2xl font-bold text-white">92%</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "92%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Patients</p>
                            <h4 className="text-2xl font-bold text-white">156</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "60%" }}></div>
                    </div>
                </div>

                <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Pending</p>
                            <h4 className="text-2xl font-bold text-white">12</h4>
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "30%" }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 bg-[#0f172a] border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Recent Prescriptions Issued</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input
                                type="text"
                                placeholder="Filter by patient..."
                                className="bg-[#1e293b] border-none py-1.5 pl-9 pr-4 text-xs rounded-full"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs uppercase text-gray-500 font-bold bg-[#1e293b]/20">
                                <tr>
                                    <th className="px-6 py-4">Prescription ID</th>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Drug Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {prescriptions.map((rx) => (
                                    <tr key={rx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-blue-400">#RX-{rx.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-gray-500" />
                                                <span className="text-white text-sm">{rx.patient}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Pill size={14} className="text-emerald-400" />
                                                <span className="text-gray-300 text-sm">{rx.drug}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${rx.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                                                }`}>
                                                {rx.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-400 hover:text-white text-xs underline">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Calendar size={18} className="text-blue-400" /> Recent Activity
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: "Rx Signed", time: "10m ago", desc: "Patient 0x33...1a2b" },
                                { label: "Verification", time: "2h ago", desc: "Doctor credentials verified" },
                                { label: "Consultation", time: "4h ago", desc: "New patient entry" },
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

export default DoctorDashboard;
