import { useDisconnect } from "@reown/appkit/react";

export const Logout = () => {
    const { disconnect } = useDisconnect();

    const logout = () => {
        disconnect()
    }
    return <svg onClick={logout} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill="#FF6969"/>
        <path d="M32 22V32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M38.4003 26.6C39.6569 27.8571 40.5132 29.4582 40.8611 31.2013C41.209 32.9444 41.0329 34.7515 40.3551 36.3947C39.6774 38.0379 38.5282 39.4436 37.0525 40.4345C35.5769 41.4254 33.8408 41.9572 32.0634 41.9628C30.2859 41.9683 28.5465 41.4474 27.0647 40.4658C25.5829 39.4841 24.4249 38.0856 23.7368 36.4467C23.0488 34.8078 22.8614 33.0019 23.1984 31.2566C23.5353 29.5114 24.3815 27.905 25.6303 26.64" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
}