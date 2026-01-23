import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACTS, ABIS, ROLES } from "../constants";

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [signer, setSigner] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contracts, setContracts] = useState({});
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const initWeb3 = useCallback(async () => {
        try {
            if (!window.ethereum) {
                throw new Error("MetaMask not found. Please install it to use this app.");
            }

            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const web3Signer = await web3Provider.getSigner();
            const userAddress = await web3Signer.getAddress();

            setProvider(web3Provider);
            setSigner(web3Signer);
            setAccount(userAddress);

            // Initialize all contracts
            const contractInstances = {};
            Object.keys(CONTRACTS).forEach((name) => {
                if (ABIS[name]) {
                    contractInstances[name] = new ethers.Contract(
                        CONTRACTS[name],
                        ABIS[name],
                        web3Signer
                    );
                }
            });
            setContracts(contractInstances);

            // Detect role
            await detectRole(userAddress, contractInstances);

            setLoading(false);
        } catch (err) {
            console.error("Initialization error:", err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    const detectRole = async (address, contractInstances) => {
        try {
            // Check Manufacturer
            const isManufacturer = await contractInstances.ManufacturerRegistry.isVerifiedManufacturer(address);
            if (isManufacturer) {
                setRole(ROLES.MANUFACTURER);
                return;
            }

            // Check Doctor
            const isDoctor = await contractInstances.DoctorRegistry.isVerifiedDoctor(address);
            if (isDoctor) {
                setRole(ROLES.DOCTOR);
                return;
            }

            // Check Pharmacy
            const isPharmacy = await contractInstances.PharmacyRegistry.isVerifiedPharmacy(address);
            if (isPharmacy) {
                setRole(ROLES.PHARMACY);
                return;
            }

            // Check Patient
            const patientId = await contractInstances.PatientRegistry.addressToPatientId(address);
            if (patientId > 0n) {
                setRole(ROLES.PATIENT);
                return;
            }

            // Default to guest or unauthorized
            setRole(null);
        } catch (err) {
            console.error("Role detection error:", err);
        }
    };

    const connectWallet = async () => {
        setLoading(true);
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            await initWeb3();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    initWeb3();
                } else {
                    setAccount(null);
                    setRole(null);
                }
            });

            window.ethereum.on("chainChanged", () => {
                window.location.reload();
            });
        }
    }, [initWeb3]);

    return (
        <Web3Context.Provider
            value={{
                account,
                signer,
                provider,
                contracts,
                role,
                loading,
                error,
                connectWallet,
                setRole // Allow manual role override for demo/testing
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};
