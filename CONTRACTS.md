# Smart Contract Documentation

## DrugNFT Contract

### Overview

The `DrugNFT` contract is a simplified ERC-721 style NFT implementation designed specifically for pharmaceutical batch authentication. Each NFT represents a unique drug batch with associated metadata including batch ID, manufacturer, expiry date, and IPFS hash for additional documentation.

### Contract Address

- **Base Sepolia**: `0xC9B5006Bd6F44c3EFc73e2a96637e286b7a37Fef`
- **Base Mainnet**: Not deployed

### Key Features

1. **Batch Minting**: Only the contract owner (manufacturer) can mint new batch NFTs
2. **Expiry Tracking**: Automatic validation of batch expiry dates
3. **Recall System**: Ability to mark batches as recalled for safety alerts
4. **Immutable Records**: Once minted, batch data cannot be altered
5. **Public Verification**: Anyone can verify batch authenticity

### State Variables

```solidity
address private _owner;                           // Contract owner
uint256 private _tokenIdCounter;                  // Token ID counter
mapping(uint256 => address) private _owners;      // Token ownership
mapping(uint256 => Batch) public batches;         // Batch information
```

### Batch Structure

```solidity
struct Batch {
    string batchId;        // Unique batch identifier (e.g., "BATCH-2025-PFZ-001")
    string manufacturer;   // Pharmaceutical company name
    uint256 expiryDate;    // Unix timestamp of expiry date
    string ipfsHash;       // IPFS hash for additional documents/certificates
    bool isRecalled;       // Flag indicating if batch has been recalled
}
```

### Functions

#### Owner Functions

##### `mintBatch`
```solidity
function mintBatch(
    string memory _batchId,
    string memory _manufacturer,
    uint256 _expiryDate,
    string memory _ipfsHash
) public onlyOwner returns (uint256)
```

Mints a new drug batch NFT.

**Parameters:**
- `_batchId`: Unique identifier for the batch
- `_manufacturer`: Name of pharmaceutical company
- `_expiryDate`: Unix timestamp when drug expires
- `_ipfsHash`: Optional IPFS hash for certificates

**Returns:**
- `newTokenId`: The ID of newly minted token

**Events Emitted:**
- `BatchMinted(tokenId, batchId, manufacturer)`
- `Transfer(address(0), owner, tokenId)`

**Access:** Owner only

---

##### `recallBatch`
```solidity
function recallBatch(uint256 tokenId) public onlyOwner
```

Recalls a drug batch (marks as unsafe).

**Parameters:**
- `tokenId`: The token ID to recall

**Events Emitted:**
- `BatchRecalled(tokenId)`

**Access:** Owner only

**Reverts:**
- "Token does not exist" if token doesn't exist

---

##### `transferOwnership`
```solidity
function transferOwnership(address newOwner) public onlyOwner
```

Transfers contract ownership to a new address.

**Parameters:**
- `newOwner`: Address of the new owner

**Events Emitted:**
- `OwnershipTransferred(previousOwner, newOwner)`

**Access:** Owner only

**Reverts:**
- "Ownable: new owner is the zero address" if newOwner is address(0)

---

#### Public View Functions

##### `getBatchDetails`
```solidity
function getBatchDetails(uint256 tokenId) public view returns (
    string memory batchId,
    string memory manufacturer,
    uint256 expiryDate,
    string memory ipfsHash,
    bool isRecalled
)
```

Retrieves complete batch information for a given token.

**Parameters:**
- `tokenId`: The token ID to query

**Returns:**
- `batchId`: The batch identifier
- `manufacturer`: The manufacturer name
- `expiryDate`: The expiry timestamp
- `ipfsHash`: The IPFS hash for documents
- `isRecalled`: Whether the batch is recalled

**Reverts:**
- "Token does not exist" if token doesn't exist

---

##### `isValid`
```solidity
function isValid(uint256 tokenId) public view returns (bool)
```

Checks if a drug batch is valid (not expired and not recalled).

**Parameters:**
- `tokenId`: The token ID to check

**Returns:**
- `bool`: True if batch is valid, false otherwise

**Validation Logic:**
- Returns `false` if batch is recalled
- Returns `false` if current time >= expiry date
- Returns `true` only if not recalled AND not expired

**Reverts:**
- "Token does not exist" if token doesn't exist

---

##### `owner`
```solidity
function owner() public view returns (address)
```

Returns the contract owner address.

**Returns:**
- `address`: Address of the current owner

---

### Events

#### `BatchMinted`
```solidity
event BatchMinted(
    uint256 indexed tokenId,
    string batchId,
    string manufacturer
);
```

Emitted when a new batch is minted.

---

#### `BatchRecalled`
```solidity
event BatchRecalled(uint256 indexed tokenId);
```

Emitted when a batch is recalled.

---

#### `Transfer`
```solidity
event Transfer(
    address indexed from,
    address indexed to,
    uint256 indexed tokenId
);
```

Emitted when a token is transferred (including minting).

---

#### `OwnershipTransferred`
```solidity
event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
);
```

Emitted when contract ownership is transferred.

---

### Usage Examples

#### Minting a Batch

```javascript
const expiryDate = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year from now

const tx = await drugNFT.mintBatch(
  "BATCH-2025-PFZ-001",
  "Pfizer Inc",
  expiryDate,
  "QmYourIPFSHash"
);

const receipt = await tx.wait();
console.log("Batch minted with Token ID:", 1);
```

#### Verifying a Batch

```javascript
const tokenId = 1;

// Get batch details
const [batchId, manufacturer, expiryDate, ipfsHash, isRecalled] = 
  await drugNFT.getBatchDetails(tokenId);

// Check if valid
const isValidBatch = await drugNFT.isValid(tokenId);

if (isValidBatch) {
  console.log("✅ AUTHENTIC - Batch is valid");
} else if (isRecalled) {
  console.log("❌ RECALLED - Batch has been recalled");
} else {
  console.log("❌ EXPIRED - Batch has expired");
}
```

#### Recalling a Batch

```javascript
const tokenId = 1;

const tx = await drugNFT.recallBatch(tokenId);
await tx.wait();

console.log("Batch recalled successfully");
```

---

### Security Considerations

1. **Owner Privileges**: Only the contract owner can mint batches and recall them
2. **Immutable Data**: Once minted, batch data cannot be modified (except recall flag)
3. **Public Verification**: Anyone can verify batch authenticity without gas fees
4. **No Token Transfers**: Current implementation doesn't support token transfers between addresses
5. **Expiry Validation**: Uses `block.timestamp` for expiry checks

---

### Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| `mintBatch` | ~150,000 |
| `recallBatch` | ~30,000 |
| `getBatchDetails` | 0 (view) |
| `isValid` | 0 (view) |
| `transferOwnership` | ~30,000 |

*Note: Gas estimates are approximate and may vary based on input data size*

---

### Testing

The contract includes 22 comprehensive tests covering:

- ✅ Deployment and ownership
- ✅ Batch minting (single and multiple)
- ✅ Access control (owner-only functions)
- ✅ Batch validation (expiry and recall)
- ✅ Batch recall functionality
- ✅ Ownership transfer
- ✅ Edge cases (exact expiry time, empty IPFS hash, long strings)

Run tests with:
```bash
npm test
```

---

## Registry Contracts

### PharmacyRegistry
- **Base Sepolia**: `0xd4C7c06008ec2EdD2dd755F3721aE61A56a0b6F7`

### ManufacturerRegistry
- **Base Sepolia**: `0x80CF0C026c825b0F62a91353A35E3Dae3Ae45FE1`

### DistributorRegistry
- **Base Sepolia**: `0xC31FF1E54Bd37475Bba8EDA4594A3F67017Cc9e8`

### DoctorRegistry
- **Base Sepolia**: `0x4416083a7D56274a2B99FC004209CF16367d161d`

### PatientRegistry
- **Base Sepolia**: `0x9EEcbDEAB648FF6EfE4b1768BeA7284b26B6aAA9`

## Supply Chain & Tracking

### BatchTransfer
- **Base Sepolia**: `0x5B58a9B053Df3ea369f25154489620e44f21feE8`

### QualityControl
- **Base Sepolia**: `0x2459e24E3Ae52237BFd7fBb61E65bF2f291bB099`

### TemperatureMonitoring
- **Base Sepolia**: `0x44A370C3DD448672620dBb7a059F49F26157765C`

### RecallManagement
- **Base Sepolia**: `0xEa11a1165e732F1C6f7aAc84cc10327FA5D6a14A`

## Functional Contracts

### DrugCatalog
- **Base Sepolia**: `0x2148eE18149EbC36878B94f2C6E598a27f5A3C2B`

### RegulatoryCompliance
- **Base Sepolia**: `0xa39192E571225B85e43EEe065F0e585f033B92B1`

### RewardToken
- **Base Sepolia**: `0xb94dbb5a5F12c2b37797F6D080cF3830adF2F2ff`

### PrescriptionNFT
- **Base Sepolia**: `0x2F8EB311bcA92eb1c4AEE095511F34Cb2F2d7967`

## Infrastructure & Integration

### AuditTrail
- **Base Sepolia**: `0xC69d2D0f9093901f4Cf6b5f9d82b7D2657aB9B3C`

### SupplyChainIntegration
- **Base Sepolia**: `0x738419f247bE2accBA8C72574e0B1e899eAaD365`

### PrescriptionVerifier
- **Base Sepolia**: `0xcC9A77027D4E39f9861Be2573F569cE3b5325D51`
