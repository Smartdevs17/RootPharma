import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Factory,
    Stethoscope,
    Pill,
    User,
    ShieldCheck,
    Search,
    Settings,
    LogOut
} from "lucide-react";
import { ROLES } from "../constants";

const Sidebar = ({ role }) => {
    const menuItems = [
        { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={20} />, path: "/" },
        {
            id: "manufacturer",
            label: "Manufacturing",
            icon: <Factory size={20} />,
            path: "/manufacturer",
            roles: [ROLES.MANUFACTURER.id]
        },
        {
            id: "doctor",
            label: "Prescriptions",
            icon: <Stethoscope size={20} />,
            path: "/doctor",
            roles: [ROLES.DOCTOR.id]
        },
        {
            id: "pharmacy",
            label: "Dispensary",
            icon: <Pill size={20} />,
            path: "/pharmacy",
            roles: [ROLES.PHARMACY.id]
        },
        {
            id: "patient",
            label: "My Health",
            icon: <User size={20} />,
            path: "/patient",
            roles: [ROLES.PATIENT.id]
        },
        {
            id: "audit",
            label: "Compliance",
            icon: <ShieldCheck size={20} />,
            path: "/audit",
            roles: [ROLES.AUDITOR.id]
        },
        { id: "traceability", label: "Traceability", icon: <Search size={20} />, path: "/trace" },
    ];

    const filteredItems = menuItems.filter(item =>
        !item.roles || (role && item.roles.includes(role.id))
    );

    return (
        <aside className="w-64 h-screen bg-[#0a0f18] text-white flex flex-col border-r border-gray-800">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00f2fe] to-[#4facfe] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <ShieldCheck className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight">RootPharma</span>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"}
            `}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-2">
                <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                >
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </NavLink>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut size={20} />
                    <span className="font-medium">Disconnect</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
