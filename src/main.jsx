import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { baseSepolia } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'


gsap.registerPlugin(useGSAP);


// register the hook to avoid React version discrepancies
const metadata = {
    name: 'Turtlets',
    description: 'Turtlets App',
    url: 'https://web3.turtlets.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}
const projectId = "252ac2900f56cdb940c0b362ee8b7ff5";

const networks = [baseSepolia];

const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,          // OK en client; mets false si tu as de l’SSR réel pour éviter les warnings
    autoConnect: true,  // 👍
});

// Modal / AppKit init (une seule fois)
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: { analytics: false },
});
const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                <App/>
        </WagmiProvider>
    </QueryClientProvider>,
)
