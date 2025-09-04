// src/components/PublicMint.tsx
import { useMemo } from "react";
import {
    useAccount,
    useReadContract,
    useWriteContract,
    useSimulateContract,
    useWaitForTransactionReceipt,
    useSwitchChain,
    useConnect,
} from "wagmi";
import { base } from "wagmi/chains";
import {
    ABI, CONTRACT_ADDRESS, useSettings, useCollectorFee, useAllowlistMint, useCurrentPhase, useFreeMint, useMint,
    useGetMintStatus
} from "../constants/contract.js";
import { formatEther } from "viem";
import { createPublicClient, http } from "viem";

// --- helper inchangé ---
async function addBaseSepoliaManually() {
    if (!window.ethereum?.request) return;
    await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0x14a34",
            chainName: "Base Sepolia",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://sepolia.base.org"],
            blockExplorerUrls: ["https://sepolia.basescan.org"],
        }],
    });
}

function useEnsureBaseSepolia() {
    const { isConnected, chainId } = useAccount();
    const { connectAsync, connectors } = useConnect();
    const { switchChainAsync } = useSwitchChain();
    return async function ensure() {
        if (!isConnected) {
            const injected = connectors.find(c => c.id === "injected") ?? connectors[0];
            await connectAsync({ connector: injected, chainId: base.id }).catch(() => {});
        }
        try {
            if (chainId !== base.id) {
                await switchChainAsync({ chainId: base.id });
            }
        } catch {
            await addBaseSepoliaManually();
            await switchChainAsync({ chainId: base.id });
        }
    };
}


export function Mint({ qty }) {
    const { address, chainId, isConnected } = useAccount();
    const ensureBaseSepolia = useEnsureBaseSepolia();


    const settings = useSettings()
    const fee = useCollectorFee()
    const phase = useCurrentPhase()

    // settings arrive généralement en array (selon l’ABI que tu passes)
    const publicMintPrice = Array.isArray(settings) ? (settings?.[1] ?? 0n) : 0n; // Settings.publicMintPrice
    const isFreeMint      = Array.isArray(settings) ? (settings?.[6] ?? false) : false; // Settings.isFreeMint
    const collectorFee    = fee ?? 0n;
    const phaseNum        = Number(phase ?? 0); // 0:Paused, 1:Allowlist, 2:Public, 3:FreeMint

    // Prix par NFT en fonction de la phase
    // Public: mintPrice + collectorFee
    // Free: collectorFee seulement
    // Allowlist: mintPrice + collectorFee (mais nécessite proof côté backend)
    const perNft = (phaseNum === 3 || isFreeMint ? 0n : publicMintPrice) + collectorFee;

    const totalValueWei = useMemo(() => {
        const q = Number.isFinite(qty) ? Math.max(1, qty) : 1;
        return 0
        return BigInt(q) * perNft;
    }, [qty, perNft]);

    // --- SIMULATION UNIQUEMENT EN PUBLIC ---
    const { error: simError } = useSimulateContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "mint",
        args: [BigInt(Math.max(1, Number(qty) || 1))],
        value: totalValueWei,
        chainId: base.id,
        query: { enabled: phaseNum === 2 && perNft > 0n }, // <- important
    });

    // --- ENVOI TX ---
    const { data: hash, isPending, writeContractAsync, error: writeErr } = useWriteContract();
    const { isLoading: waiting, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash });


    async function mint() {
        await ensureBaseSepolia();

        if (phaseNum !== 2) {
            // Pour Allowlist/FreeMint, il faut appeler allowlistMint/freeMint avec un proof
            throw new Error(`Phase actuelle: ${["Paused","Allowlist","Public","FreeMint"][phaseNum] || "?"}. Utilise la fonction adaptée.`);
        }

        if (perNft === 0n) throw new Error("Total par NFT = 0 wei. Vérifie publicMintPrice/collectorFee.");

        await writeContractAsync({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "mint",
            args: [BigInt(Math.max(1, Number(qty) || 1))],
            value: totalValueWei,
            chainId: base.id,
        });
    }

    const disabled =
        !isConnected ||
        isPending ||
        waiting ||
        (phaseNum !== 2) ||
        perNft === 0n ||
        !!simError;

    return (
        <div>
            <a onClick={mint}
               className="flex pixel-font-3 text-3xl px-12 bg-white text-black items-center justify-center cursor-pointer hover:bg-black hover:text-white hover:ring-1 hover:ring-white h-[64px]">
                <p>{`MINT ${qty}`}</p>
            </a>
        </div>
    );
}
