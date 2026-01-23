import React from "react";

export const ManufacturerDashboard = () => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Manufacturer Dashboard</h2>
        <p className="text-gray-400">Manage drug batches, minting, and recalls.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-[#0f172a] border border-gray-800 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Mint New Batch</h3>
                <p className="text-gray-400 mb-6">Create a new batch of pharmaceutical products on the blockchain.</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                    Start Minting
                </button>
            </div>
            <div className="bg-[#0f172a] border border-gray-800 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Active Recalls</h3>
                <p className="text-gray-400 mb-6">Monitor and manage any active recalls for your products.</p>
                <button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-6 py-2 rounded-lg font-semibold transition-all">
                    View Recalls
                </button>
            </div>
        </div>
    </div>
);

export const DoctorDashboard = () => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Doctor Dashboard</h2>
        <p className="text-gray-400">Issue and manage digital prescriptions.</p>
        <div className="bg-[#0f172a] border border-gray-800 p-8 rounded-2xl mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Issue Digital Prescription</h3>
            <p className="text-gray-400 mb-6">Securely issue a new e-prescription to a patient's wallet.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                New Prescription
            </button>
        </div>
    </div>
);

export const PharmacyDashboard = () => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Pharmacy Dashboard</h2>
        <p className="text-gray-400">Verify and fill digital prescriptions.</p>
        <div className="bg-[#0f172a] border border-gray-800 p-8 rounded-2xl mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Fill Prescription</h3>
            <p className="text-gray-400 mb-6">Scan and verify a patient's digital prescription NFT.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                Scan Prescription
            </button>
        </div>
    </div>
);

export const PatientDashboard = () => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">My Health Portfolio</h2>
        <p className="text-gray-400">View your prescriptions and medical history.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-[#0f172a] border border-gray-800 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">My Prescriptions</h3>
                <p className="text-gray-400 mb-6">Access your active and past prescriptions.</p>
                <button className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-6 py-2 rounded-lg font-semibold transition-all">
                    View List
                </button>
            </div>
        </div>
    </div>
);

export const AuditorDashboard = () => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Compliance & Audit</h2>
        <p className="text-gray-400">Independent verification of the supply chain.</p>
        <div className="bg-[#0f172a] border border-gray-800 p-8 rounded-2xl mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Audit Trails</h3>
            <p className="text-gray-400 mb-6">Inspect immutable logs of all supply chain events.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                Run Global Audit
            </button>
        </div>
    </div>
);

export const Traceability = () => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Product Traceability</h2>
        <p className="text-gray-400">Track and trace any drug batch from manufacturer to patient.</p>
        <div className="max-w-2xl bg-[#0f172a] border border-gray-800 p-8 rounded-2xl mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Track Batch ID</h3>
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Enter Batch Token ID..."
                    className="flex-1 bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                    Trace
                </button>
            </div>
        </div>
    </div>
);
