# RootPharma Security Policy

RootPharma prioritizes the security and integrity of the pharmaceutical supply chain. This document outlines our safety protocols and reporting procedures.

## Security Model

### On-Chain Safeguards
- **Access Control**: All critical functions are protected by role-based access controls (RBAC) defined in the core registries.
- **Auditor Overrides**: Authorized regulatory bodies can trigger global recalls and facility revocations via dedicated surveillance interfaces.
- **Immutable Provenance**: The identity of drug batches and prescriptions is anchored to non-fungible tokens, ensuring a tamper-proof history of every medical asset.

## Reporting a Vulnerability

If you discover a security vulnerability within the RootPharma ecosystem, please follow these steps:

1. **Email Us**: Send a detailed report to security@rootpharma.network.
2. **Include Details**: Provide a clear description of the vulnerability, steps to reproduce, and potential impact.
3. **Responsible Disclosure**: We request that you do not disclose the vulnerability publicly until we have had sufficient time to analyze and mitigate the risk.

## Incident Response

In the event of a significant security breach:
1. **Network Pause**: Contract owners can trigger circuit breakers to prevent further state changes.
2. **Forensic Audit**: The Base L2 transaction history will be analyzed using the `AuditTrail.sol` logs.
3. **Participant Notification**: All verified entities (Manufacturers, Pharmacies, Doctors) will be notified of the event and required actions.

## Governance & Compliance

RootPharma is designed to align with major pharmaceutical regulations (e.g., DSCSA, GDPR for patient data). Our security posture is continuously reviewed by both clinical and cryptographic experts.
