import {useReadContract, useWriteContract, useReadContracts} from 'wagmi';
import {parseEther} from 'viem';
import {useMemo} from 'react';
import {baseSepolia} from "wagmi/chains";

export const CONTRACT_ADDRESS = import.meta.env.VITE_SEASON_1_CONTRACT_ADDRESS

export const ABI = [{"inputs": [], "stateMutability": "nonpayable", "type": "constructor"}, {
    "inputs": [],
    "name": "ApprovalCallerNotOwnerNorApproved",
    "type": "error"
}, {"inputs": [], "name": "ApprovalQueryForNonexistentToken", "type": "error"}, {
    "inputs": [],
    "name": "BalanceQueryForZeroAddress",
    "type": "error"
}, {"inputs": [], "name": "ExceedsMaxPerAddress", "type": "error"}, {
    "inputs": [],
    "name": "ExceedsSupply",
    "type": "error"
}, {"inputs": [], "name": "InvalidPayment", "type": "error"}, {
    "inputs": [],
    "name": "InvalidPhase",
    "type": "error"
}, {"inputs": [], "name": "InvalidTime", "type": "error"}, {
    "inputs": [],
    "name": "MintERC2309QuantityExceedsLimit",
    "type": "error"
}, {"inputs": [], "name": "MintToZeroAddress", "type": "error"}, {
    "inputs": [],
    "name": "MintZeroQuantity",
    "type": "error"
}, {
    "inputs": [{"internalType": "string", "name": "message", "type": "string"}],
    "name": "MintbayInvalidInput",
    "type": "error"
}, {"inputs": [], "name": "NotAuthorized", "type": "error"}, {
    "inputs": [],
    "name": "NotCompatibleWithSpotMints",
    "type": "error"
}, {"inputs": [], "name": "NotInAllowlist", "type": "error"}, {
    "inputs": [],
    "name": "OwnerQueryForNonexistentToken",
    "type": "error"
}, {"inputs": [], "name": "OwnershipNotInitializedForExtraData", "type": "error"}, {
    "inputs": [],
    "name": "PhaseNotActive",
    "type": "error"
}, {"inputs": [], "name": "SequentialMintExceedsLimit", "type": "error"}, {
    "inputs": [],
    "name": "SequentialUpToTooSmall",
    "type": "error"
}, {"inputs": [], "name": "SpotMintTokenIdTooSmall", "type": "error"}, {
    "inputs": [],
    "name": "TokenAlreadyExists",
    "type": "error"
}, {"inputs": [], "name": "TransferCallerNotOwnerNorApproved", "type": "error"}, {
    "inputs": [],
    "name": "TransferFromIncorrectOwner",
    "type": "error"
}, {"inputs": [], "name": "TransferToNonERC721ReceiverImplementer", "type": "error"}, {
    "inputs": [],
    "name": "TransferToZeroAddress",
    "type": "error"
}, {"inputs": [], "name": "URIQueryForNonexistentToken", "type": "error"}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "bytes32", "name": "root", "type": "bytes32"}],
    "name": "AllowlistRootUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
    }, {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "Approval",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
    }, {"indexed": false, "internalType": "bool", "name": "approved", "type": "bool"}],
    "name": "ApprovalForAll",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "_fromTokenId",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "_toTokenId", "type": "uint256"}],
    "name": "BatchMetadataUpdate",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "uint256",
        "name": "fromTokenId",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "toTokenId", "type": "uint256"}, {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "to", "type": "address"}],
    "name": "ConsecutiveTransfer",
    "type": "event"
}, {"anonymous": false, "inputs": [], "name": "ContractSealed", "type": "event"}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "enum MintbayGenerative.MintPhase",
        "name": "phaseType",
        "type": "uint8"
    }, {"indexed": false, "internalType": "uint256", "name": "phaseId", "type": "uint256"}],
    "name": "CurrentPhaseChanged",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint8", "name": "version", "type": "uint8"}],
    "name": "Initialized",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "_tokenId", "type": "uint256"}],
    "name": "MetadataUpdate",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "compositeIndex", "type": "uint256"}],
    "name": "Minted",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "uint256",
        "name": "phaseId",
        "type": "uint256"
    }, {
        "components": [{
            "internalType": "enum MintbayGenerative.MintPhase",
            "name": "phaseType",
            "type": "uint8"
        }, {"internalType": "uint256", "name": "startTime", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "mintPrice", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "maxPerAddress",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "maxSupply", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "mintedInPhase",
            "type": "uint256"
        }, {"internalType": "bytes32", "name": "allowlistRoot", "type": "bytes32"}],
        "indexed": false,
        "internalType": "struct MintbayGenerative.Phase",
        "name": "phase",
        "type": "tuple"
    }],
    "name": "PhaseUpdated",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "from", "type": "address"}, {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "Transfer",
    "type": "event"
}, {
    "inputs": [{
        "internalType": "enum MintbayGenerative.MintPhase",
        "name": "phaseType",
        "type": "uint8"
    }, {"internalType": "uint256", "name": "startTime", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "mintPrice", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "maxPerAddress",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "_maxSupply", "type": "uint256"}, {
        "internalType": "bytes32",
        "name": "allowlistRoot",
        "type": "bytes32"
    }], "name": "addPhase", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "uint256[]", "name": "layerIds", "type": "uint256[]"}, {
        "internalType": "uint256[][]",
        "name": "traitIds",
        "type": "uint256[][]"
    }, {"internalType": "uint8[][]", "name": "encodingTypes", "type": "uint8[][]"}, {
        "internalType": "bytes[][]",
        "name": "datas",
        "type": "bytes[][]"
    }, {"internalType": "string[][]", "name": "names", "type": "string[][]"}],
    "name": "addTraitsForLayers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "quantity", "type": "uint256"}, {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
    }], "name": "allowlistMint", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
    }], "name": "approve", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "baseURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "collectorFee",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "currentPhase",
    "outputs": [{"internalType": "enum MintbayGenerative.MintPhase", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "currentPhaseId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "didMintEnd",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "quantity", "type": "uint256"}, {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
    }], "name": "freeMint", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getApproved",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getCompositeIndex",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getMintStatus",
    "outputs": [{
        "components": [{
            "internalType": "uint256",
            "name": "mintStart",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "publicMintPrice", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "maxSupply",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "totalMinted", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "collectorFee",
            "type": "uint256"
        }, {"internalType": "bool", "name": "isRevealed", "type": "bool"}, {
            "internalType": "bool",
            "name": "isFreeMint",
            "type": "bool"
        }], "internalType": "struct MintStatus", "name": "status", "type": "tuple"
    }, {
        "internalType": "enum MintbayGenerative.MintPhase",
        "name": "currentPhaseType",
        "type": "uint8"
    }, {
        "components": [{
            "internalType": "enum MintbayGenerative.MintPhase",
            "name": "phaseType",
            "type": "uint8"
        }, {"internalType": "uint256", "name": "startTime", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "mintPrice", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "maxPerAddress",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "maxSupply", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "mintedInPhase",
            "type": "uint256"
        }, {"internalType": "bytes32", "name": "allowlistRoot", "type": "bytes32"}],
        "internalType": "struct MintbayGenerative.Phase",
        "name": "activePhase",
        "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "getPixelDataContract",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "string", "name": "_name", "type": "string"}, {
        "internalType": "string",
        "name": "_symbol",
        "type": "string"
    }, {"internalType": "uint256", "name": "_maxSupply", "type": "uint256"}, {
        "components": [{
            "internalType": "uint256",
            "name": "maxPerAddress",
            "type": "uint256"
        }, {"internalType": "uint256", "name": "publicMintPrice", "type": "uint256"}, {
            "internalType": "uint256",
            "name": "mintStart",
            "type": "uint256"
        }, {"internalType": "bool", "name": "isContractSealed", "type": "bool"}, {
            "internalType": "string",
            "name": "description",
            "type": "string"
        }, {"internalType": "string", "name": "placeholderImage", "type": "string"}, {
            "internalType": "bool",
            "name": "isFreeMint",
            "type": "bool"
        }], "internalType": "struct Settings", "name": "_settings", "type": "tuple"
    }, {
        "components": [{
            "internalType": "address",
            "name": "royaltyAddress",
            "type": "address"
        }, {"internalType": "uint96", "name": "royaltyAmount", "type": "uint96"}],
        "internalType": "struct RoyaltySettings",
        "name": "_royaltySettings",
        "type": "tuple"
    }, {
        "components": [{
            "internalType": "address",
            "name": "recipientAddress",
            "type": "address"
        }, {"internalType": "uint256", "name": "percentage", "type": "uint256"}],
        "internalType": "struct WithdrawRecipient[]",
        "name": "_withdrawRecipients",
        "type": "tuple[]"
    }, {
        "components": [{
            "internalType": "address",
            "name": "mintbaySecurity",
            "type": "address"
        }, {"internalType": "address", "name": "collectorFeeRecipient", "type": "address"}, {
            "internalType": "uint256",
            "name": "collectorFee",
            "type": "uint256"
        }, {"internalType": "address", "name": "deployer", "type": "address"}, {
            "internalType": "address",
            "name": "operatorFilter",
            "type": "address"
        }, {"internalType": "uint256", "name": "signatureLifespan", "type": "uint256"}],
        "internalType": "struct FactorySettings",
        "name": "_factorySettings",
        "type": "tuple"
    }, {"internalType": "address", "name": "_pixelDataContract", "type": "address"}],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {
        "internalType": "address",
        "name": "operator",
        "type": "address"
    }],
    "name": "isApprovedForAll",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "phaseId", "type": "uint256"}],
    "name": "isPhaseEnded",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "isRevealed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "quantity", "type": "uint256"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "phaseCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "phaseMinted",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "phases",
    "outputs": [{
        "internalType": "enum MintbayGenerative.MintPhase",
        "name": "phaseType",
        "type": "uint8"
    }, {"internalType": "uint256", "name": "startTime", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "mintPrice", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "maxPerAddress",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "maxSupply", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "mintedInPhase",
        "type": "uint256"
    }, {"internalType": "bytes32", "name": "allowlistRoot", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "salePrice",
        "type": "uint256"
    }],
    "name": "royaltyInfo",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
    }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
    "inputs": [],
    "name": "sealContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "bytes32", "name": "_root", "type": "bytes32"}],
    "name": "setAllowlistRoot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "operator", "type": "address"}, {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
    }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{"internalType": "string", "name": "uri", "type": "string"}],
    "name": "setBaseURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "phaseId", "type": "uint256"}],
    "name": "setCurrentPhase",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "maxPerAddress", "type": "uint256"}],
    "name": "setMaxPerAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "mintStart", "type": "uint256"}],
    "name": "setMintStart",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "_pixelDataContract", "type": "address"}],
    "name": "setPixelDataContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "publicMintPrice", "type": "uint256"}],
    "name": "setPublicMintPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {
        "internalType": "bool",
        "name": "renderOffChain",
        "type": "bool"
    }], "name": "setRenderOfTokenId", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [],
    "name": "setRevealSeed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "settings",
    "outputs": [{"internalType": "uint256", "name": "maxPerAddress", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "publicMintPrice",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "mintStart", "type": "uint256"}, {
        "internalType": "bool",
        "name": "isContractSealed",
        "type": "bool"
    }, {"internalType": "string", "name": "description", "type": "string"}, {
        "internalType": "string",
        "name": "placeholderImage",
        "type": "string"
    }, {"internalType": "bool", "name": "isFreeMint", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "components": [{"internalType": "bytes32", "name": "r", "type": "bytes32"}, {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
        }, {"internalType": "uint8", "name": "v", "type": "uint8"}],
        "internalType": "struct Signature",
        "name": "signature",
        "type": "tuple"
    }, {"internalType": "uint256", "name": "_nonce", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "_maxPerAddress", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_mintPrice",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "_collectorFee", "type": "uint256"}],
    "name": "signatureMint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}],
    "name": "supportsInterface",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "result", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "bytes32",
        "name": "messageHash",
        "type": "bytes32"
    }, {
        "components": [{"internalType": "bytes32", "name": "r", "type": "bytes32"}, {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
        }, {"internalType": "uint8", "name": "v", "type": "uint8"}],
        "internalType": "struct Signature",
        "name": "signature",
        "type": "tuple"
    }],
    "name": "verifySignature",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "pure",
    "type": "function"
}, {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "withdrawRecipients",
    "outputs": [{"internalType": "address", "name": "recipientAddress", "type": "address"}, {
        "internalType": "uint256",
        "name": "percentage",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}]

// Hook to read getMintStatus (replaces settings)
export const useGetMintStatus = () => {
    return useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'getMintStatus',
    });
};

// Hook to read collectorFee (extracted from getMintStatus)
export const useCollectorFee = () => {
    const {data} = useGetMintStatus();
    return data ? data[0].collectorFee : undefined;
};

// Hook to read currentPhase (extracted from getMintStatus, 0 Paused, 1 Allowlist, 2 Public, 3 FreeMint)
export const useCurrentPhase = () => {
    const {data} = useGetMintStatus();
    return data ? data[1] : undefined;
};

// Approximated settings hook based on getMintStatus
export const useSettings = () => {
    const {data} = useGetMintStatus();
    if (!data) return undefined;
    const [status, phaseType, phase] = data;
    return [
        phase.maxPerAddress, // maxPerAddress
        status.publicMintPrice, // publicMintPrice
        status.mintStart, // mintStart
        false, // isContractSealed (not directly available, assuming false or use another method if needed)
        "", // description (not available)
        "", // placeholderImage (not available)
        status.isFreeMint, // isFreeMint
    ];
};

// Hook to prepare and write mint transaction
export const useMint = () => {
    const {writeContract} = useWriteContract();

    const mint = (quantity, value) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            chainId: baseSepolia.id,
            abi: ABI,
            functionName: 'mint',
            args: [quantity],
            value: parseEther(value), // Adjust based on mintPrice
        });
    };

    return mint;
};

// Hook to prepare and write allowlistMint transaction
export const useAllowlistMint = () => {
    const {writeContract} = useWriteContract();

    const allowlistMint = (quantity, proof, value) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            chainId: baseSepolia.id,
            abi: ABI,
            functionName: 'allowlistMint',
            args: [quantity, proof],
            value: parseEther(value), // Adjust based on mint price
        });
    };

    return allowlistMint;
};

// Hook to prepare and write freeMint transaction
export const useFreeMint = () => {
    const {writeContract} = useWriteContract();

    const freeMint = (quantity, proof) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            chainId: baseSepolia.id,
            abi: ABI,
            functionName: 'freeMint',
            args: [quantity, proof],
        });
    };

    return freeMint;
};

export const useMaxSupply = () => {
    return useReadContract({
        address: CONTRACT_ADDRESS,
        chainId: baseSepolia.id,
        abi: ABI,
        functionName: 'maxSupply',
    });
};
export const useTotalSupply = () => {
    return useReadContract({
        address: CONTRACT_ADDRESS,
        chainId: baseSepolia.id,
        abi: ABI,
        functionName: 'totalSupply',
    });
};

// Hook to get owned token IDs for an address (per address - note: this scans all tokens, inefficient for large totalSupply)
export const useOwnedTokenIds = (ownerAddress) => {
    const {data: totalSupply} = useTotalSupply();

    const contracts = useMemo(() => {
        if (!totalSupply || !ownerAddress) return [];
        return Array.from({length: Number(totalSupply)}, (_, i) => ({
            address: CONTRACT_ADDRESS,
            chainId: baseSepolia.id,
            abi: ABI,
            functionName: 'ownerOf',
            args: [BigInt(i + 1)], // Assuming token IDs start from 1
        }));
    }, [totalSupply, ownerAddress]);

    const {data: owners} = useReadContracts({contracts});

    return useMemo(() => {
        if (!owners || !ownerAddress) return [];
        return owners
            .map((result, index) => (result.status === 'success' && (result.result)?.toLowerCase() === ownerAddress.toLowerCase() ? BigInt(index + 1) : null))
            .filter((id) => id !== null);
    }, [owners, ownerAddress]);
};

// Hook to get all token IDs globally (all minted tokens)
export const useAllTokenIds = () => {
    const {data: totalSupply} = useTotalSupply();
    return useMemo(() => {
        if (!totalSupply) return [];
        return Array.from({length: Number(totalSupply)}, (_, i) => BigInt(i + 1)); // Assuming token IDs start from 1
    }, [totalSupply]);
};

// Hook to get tokenURIs for given token IDs (batch, works for both per address and global)
export const useTokenURIs = (tokenIds = []) => {
    const contracts = useMemo(() => {
        return tokenIds.map((id) => ({
            address: CONTRACT_ADDRESS,
            chainId: baseSepolia.id,
            abi: ABI,
            functionName: 'tokenURI',
            args: [id],
        }));
    }, [tokenIds]);

    const {data} = useReadContracts({contracts});

    return useMemo(() => {
        return data?.map((result) => (result.status === 'success' ? (result.result) : '')) || [];
    }, [data]);
};

// Utility function to extract SVG from tokenURI (assuming on-chain data URI)
export const extractSvgFromTokenURI = (tokenURI) => {
    if (!tokenURI.startsWith('data:application/json;base64,')) return null;
    const base64Json = tokenURI.slice('data:application/json;base64,'.length);
    const json = atob(base64Json);
    const metadata = JSON.parse(json);
    const image = metadata.image;
    if (!image.startsWith('data:image/svg+xml;base64,')) return null;
    const base64Svg = image.slice('data:image/svg+xml;base64,'.length);
    return atob(base64Svg);
};