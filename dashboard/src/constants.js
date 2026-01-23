export const CONTRACTS = {
  DrugNFT: "0xC9B5006Bd6F44c3EFc73e2a96637e286b7a37Fef",
  ManufacturerRegistry: "0x80CF0C026c825b0F62a91353A35E3Dae3Ae45FE1",
  PharmacyRegistry: "0xd4C7c06008ec2EdD2dd755F3721aE61A56a0b6F7",
  DistributorRegistry: "0xC31FF1E54Bd37475Bba8EDA4594A3F67017Cc9e8",
  DoctorRegistry: "0x4416083a7D56274a2B99FC004209CF16367d161d",
  PatientRegistry: "0x9EEcbDEAB648FF6EfE4b1768BeA7284b26B6aAA9",
  BatchTransfer: "0x5B58a9B053Df3ea369f25154489620e44f21feE8",
  QualityControl: "0x2459e24E3Ae52237BFd7fBb61E65bF2f291bB099",
  TemperatureMonitoring: "0x44A370C3DD448672620dBb7a059F49F26157765C",
  RecallManagement: "0xEa11a1165e732F1C6f7aAc84cc10327FA5D6a14A",
  DrugCatalog: "0x2148eE18149EbC36878B94f2C6E598a27f5A3C2B",
  RegulatoryCompliance: "0xa39192E571225B85e43EEe065F0e585f033B92B1",
  RewardToken: "0xb94dbb5a5F12c2b37797F6D080cF3830adF2F2ff",
  PrescriptionNFT: "0x2F8EB311bcA92eb1c4AEE095511F34Cb2F2d7967",
  AuditTrail: "0xC69d2D0f9093901f4Cf6b5f9d82b7D2657aB9B3C",
  SupplyChainIntegration: "0x738419f247bE2accBA8C72574e0B1e899eAaD365",
  PrescriptionVerifier: "0xcC9A77027D4E39f9861Be2573F569cE3b5325D51"
};

export const ROLES = {
  MANUFACTURER: { id: "MANUFACTURER", label: "Manufacturer", color: "#00f2fe", path: "/manufacturer" },
  PHARMACY: { id: "PHARMACY", label: "Pharmacy", color: "#00ffcc", path: "/pharmacy" },
  DOCTOR: { id: "DOCTOR", label: "Doctor", color: "#a78bfa", path: "/doctor" },
  PATIENT: { id: "PATIENT", label: "Patient", color: "#fb7185", path: "/patient" },
  AUDITOR: { id: "AUDITOR", label: "Global Auditor", color: "#fbbf24", path: "/audit" }
};

export const ABIS = {
  DrugNFT: [
    "function mintBatch(string _batchId, string _manufacturer, uint256 _expiryDate, string _ipfsHash) public returns (uint256)",
    "function getBatchDetails(uint256 tokenId) public view returns (string, string, uint256, string, bool)",
    "function isValid(uint256 tokenId) public view returns (bool)",
    "function recallBatch(uint256 tokenId) public",
    "event BatchMinted(uint256 indexed tokenId, string batchId, string manufacturer)"
  ],
  ManufacturerRegistry: [
    "function registerManufacturer(string _companyName, string _registrationNumber, string _country, address _walletAddress, string _gmpCertificate, string _contactEmail) public returns (uint256)",
    "function getManufacturer(uint256 _manufacturerId) public view returns (tuple(string companyName, string registrationNumber, string country, address walletAddress, bool isVerified, bool isActive, uint256 registrationDate, uint256 lastAuditDate, string gmpCertificate, string contactEmail, uint256 totalBatchesProduced))",
    "function isVerifiedManufacturer(address _address) public view returns (bool)",
    "function addressToManufacturerId(address) public view returns (uint256)",
    "function getTotalManufacturers() public view returns (uint256)"
  ],
  PharmacyRegistry: [
    "function registerPharmacy(string _name, string _licenseNumber, string _location, address _walletAddress, string _contactEmail, string _phoneNumber) public returns (uint256)",
    "function isVerifiedPharmacy(address _address) public view returns (bool)",
    "function getPharmacy(uint256 _pharmacyId) public view returns (tuple(string name, string licenseNumber, string location, address walletAddress, bool isVerified, bool isActive, uint256 registrationDate, uint256 lastUpdateDate, string contactEmail, string phoneNumber))"
  ],
  DoctorRegistry: [
    "function registerDoctor(string _name, string _licenseNumber, string _specialization, address _walletAddress) public returns (uint256)",
    "function isVerifiedDoctor(address _address) public view returns (bool)",
    "function getDoctor(uint256 _doctorId) public view returns (tuple(uint256 doctorId, string name, string licenseNumber, string specialization, address walletAddress, bool isVerified, bool isActive, uint256 registrationDate, uint256 totalPrescriptions))"
  ],
  PatientRegistry: [
    "function registerPatient(bytes32 _nameHash, uint256 _dateOfBirth, address _walletAddress) public returns (uint256)",
    "function patients(uint256) public view returns (uint256 patientId, bytes32 nameHash, uint256 dateOfBirth, address walletAddress, bool isActive, uint256 registrationDate)",
    "function addressToPatientId(address) public view returns (uint256)"
  ],
  PrescriptionNFT: [
    "function issuePrescription(address _patient, uint256 _patientId, uint256 _doctorId, uint256 _drugId, string _dosage, uint256 _expiryDate, string _notes) public returns (uint256)",
    "function fillPrescription(uint256 _tokenId, uint256 _pharmacyId) public",
    "function prescriptions(uint256) public view returns (uint256 patientId, uint256 doctorId, uint256 drugId, string dosage, uint256 issueDate, uint256 expiryDate, bool isFilled, uint256 pharmacyId, string notes)"
  ],
  AuditTrail: [
    "function getBatchAuditTrail(uint256 _batchTokenId) public view returns (tuple(uint256 batchTokenId, string action, address actor, uint256 timestamp, string details, bytes32 dataHash)[])",
    "function getTotalAuditEntries() public view returns (uint256)"
  ],
  TemperatureMonitoring: [
    "function getReadings(uint256 _batchTokenId) public view returns (tuple(uint256 batchTokenId, int256 temperature, uint256 timestamp, string location, address sensor)[])",
    "function hasViolations(uint256 _batchTokenId) public view returns (bool)"
  ],
  DistributorRegistry: [
    "function registerDistributor(string _name, string _licenseNumber, string _region, address _walletAddress) public returns (uint256)",
    "function isVerifiedDistributor(address _address) public view returns (bool)",
    "function getDistributor(uint256 _distributorId) public view returns (tuple(uint256 distributorId, string name, string licenseNumber, string region, address walletAddress, bool isVerified, bool isActive, uint256 totalDeliveries, uint256 registrationDate))",
    "function recordDelivery(uint256 _distributorId) public",
    "function getTotalDistributors() public view returns (uint256)",
    "function addressToDistributorId(address) public view returns (uint256)"
  ],
  BatchTransfer: [
    "function initiateTransfer(uint256 _batchTokenId, address _to, string _location, string _notes) public",
    "function confirmReceipt(uint256 _batchTokenId) public",
    "function getCurrentHolder(uint256 _batchTokenId) public view returns (address)",
    "function getTransferHistory(uint256 _batchTokenId) public view returns (tuple(uint256 batchTokenId, address from, address to, uint256 timestamp, string location, string notes, bool isReceived)[])"
  ],
  QualityControl: [
    "function performQualityCheck(uint256 _batchTokenId, bool _passed, string _testType, string _results, string _notes) public",
    "function getQualityChecks(uint256 _batchTokenId) public view returns (tuple(uint256 batchTokenId, address inspector, uint256 timestamp, bool passed, string testType, string results, string notes)[])",
    "function hasPassedQualityControl(uint256 _batchTokenId) public view returns (bool)",
    "function authorizeInspector(address _inspector) public"
  ],
  RecallManagement: [
    "function issueRecall(uint256 _batchTokenId, string _reason, uint256 _severity, string[] _affectedRegions) public",
    "function resolveRecall(uint256 _batchTokenId, uint256 _recallIndex) public",
    "function isRecalled(uint256 _batchTokenId) public view returns (bool)",
    "function getActiveRecalls(uint256 _batchTokenId) public view returns (tuple(uint256 batchTokenId, string reason, uint256 recallDate, address recalledBy, bool isActive, string[] affectedRegions, uint256 severity)[])",
    "function getRecalls(uint256 _batchTokenId) public view returns (tuple(uint256 batchTokenId, string reason, uint256 recallDate, address recalledBy, bool isActive, string[] affectedRegions, uint256 severity)[])"
  ],
  DrugCatalog: [
    "function registerDrug(string _drugName, string _genericName, string _activeIngredient, string _dosageForm, string _strength, string _manufacturer) public returns (uint256)",
    "function approveDrug(uint256 _drugId) public",
    "function getDrugInfo(uint256 _drugId) public view returns (string, string, string, string, string, string, bool)",
    "function addSideEffect(uint256 _drugId, string _sideEffect) public",
    "function addContraindication(uint256 _drugId, string _contraindication) public",
    "function getSideEffects(uint256 _drugId) public view returns (string[])",
    "function getContraindications(uint256 _drugId) public view returns (string[])",
    "function drugNameToId(string) public view returns (uint256)"
  ],
  RegulatoryCompliance: [
    "function grantApproval(uint256 _batchTokenId, string _regulatoryBody, string _approvalNumber, uint256 _expiryDate, string _documentHash) public",
    "function revokeApproval(uint256 _batchTokenId, uint256 _approvalIndex) public",
    "function isCompliant(uint256 _batchTokenId) public view returns (bool)",
    "function getApprovals(uint256 _batchTokenId) public view returns (tuple(string regulatoryBody, string approvalNumber, uint256 approvalDate, uint256 expiryDate, bool isActive, string documentHash)[])",
    "function recognizeRegulatoryBody(string _bodyName) public"
  ],
  RewardToken: [
    "function mintRewards(address _to, uint256 _amount) public",
    "function balanceOf(address account) public view returns (uint256)",
    "function totalSupply() public view returns (uint256)",
    "function transfer(address to, uint256 value) public returns (bool)",
    "function approve(address spender, uint256 value) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function addMinter(address _minter) public",
    "function removeMinter(address _minter) public"
  ],
  SupplyChainIntegration: [
    "function linkBatchToOrder(uint256 _batchId, uint256 _orderId) public",
    "function isLinked(uint256) public view returns (bool)",
    "function batchToOrderId(uint256) public view returns (uint256)",
    "function supplyChainPayment() public view returns (address)",
    "function batchTransfer() public view returns (address)"
  ],
  PrescriptionVerifier: [
    "function verify(uint256 _expiryTime, bool _doctorIsActive) public view returns (bool)",
    "function addRule(string _name, uint256 _minValue, bool _requiresActiveDoctor) public",
    "function ruleCount() public view returns (uint256)",
    "function rules(uint256) public view returns (string name, uint256 minValue, bool requiresActiveDoctor, bool isActive)"
  ]
};
