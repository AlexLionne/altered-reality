import { useAppKit } from "@reown/appkit/react";
import { useSignMessage } from "wagmi";

export const Wallet = ({scale}) => {
    const { signMessage, data, isPending } = useSignMessage();

    const { open, close } = useAppKit();

    const openWallet = () => {
        signMessage({ message: "Hello Turtlets" })
        open({ view: "Connect" });
    }
    return <svg onClick={openWallet} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill="white"/>
        <path d="M39 27V24C39 23.7348 38.8946 23.4804 38.7071 23.2929C38.5196 23.1054 38.2652 23 38 23H25C24.4696 23 23.9609 23.2107 23.5858 23.5858C23.2107 23.9609 23 24.4696 23 25C23 25.5304 23.2107 26.0391 23.5858 26.4142C23.9609 26.7893 24.4696 27 25 27H40C40.2652 27 40.5196 27.1054 40.7071 27.2929C40.8946 27.4804 41 27.7348 41 28V32M41 32H38C37.4696 32 36.9609 32.2107 36.5858 32.5858C36.2107 32.9609 36 33.4696 36 34C36 34.5304 36.2107 35.0391 36.5858 35.4142C36.9609 35.7893 37.4696 36 38 36H41C41.2652 36 41.5196 35.8946 41.7071 35.7071C41.8946 35.5196 42 35.2652 42 35V33C42 32.7348 41.8946 32.4804 41.7071 32.2929C41.5196 32.1054 41.2652 32 41 32Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 25V39C23 39.5304 23.2107 40.0391 23.5858 40.4142C23.9609 40.7893 24.4696 41 25 41H40C40.2652 41 40.5196 40.8946 40.7071 40.7071C40.8946 40.5196 41 40.2652 41 40V36" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
}