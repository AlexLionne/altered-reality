import {GridBG} from './assets/grid.jsx'
import {Logo} from "./assets/logo.jsx";
import {Placeholder} from "./assets/placeholder.jsx";
import {Wallet} from "./assets/wallet.jsx";
import {Locked} from "./assets/locked.jsx";
import gsap from 'gsap'
import {useRef, useEffect, useState} from 'react';
import {PlaceholderEp2} from "./assets/placeholder-ep-2.jsx";
import {PlaceholderEp3} from "./assets/placeholder-ep-3.jsx";
import {useAppKitAccount} from "@reown/appkit/react";
import {Logout} from "./assets/logout.jsx";
import Slider from "./components/slider.jsx";
import {useAllTokenIds, useTokenURIs, useOwnedTokenIds, useTotalSupply, useMaxSupply} from "./constants/contract.js";
import {RightDrawer} from "./components/right-drawer.jsx";


function Loader() {
    const container = useRef();

    useEffect(() => {
        let tl = gsap.timeline();
        tl.to(".logo", {duration: 1, opacity: 0})
        tl.to(".logo", {duration: 1, opacity: 1})
        tl.resume()
        tl.repeat(-1)
    }, []);


    return <div className="h-screen w-screen flex items-center justify-center m-0">
        <Logo className={'logo'} scale={6} ref={container}/>
    </div>
}

function NftViewer({ dataUri }) {
    const base64 = dataUri.split(",")[1];
    const jsonStr = atob(base64);
    const metadata = JSON.parse(jsonStr);

    return <img className={'h-full w-full'} src={metadata.image_data} alt={metadata.name} />
}

function App() {
    const {address, isConnected} = useAppKitAccount();

    const floor = 0.0020
    const [isLoading, setIsLoading] = useState(true)
    const [nbMint, setNbMint] = useState(1)


    const addToMint = async () => {
        setNbMint(b => b + 1)
    }

    const removeToMint = async () => {
        setNbMint(b => b - 1)
    }


    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000);
    }, [])

    const a = useAllTokenIds();
    const b = useOwnedTokenIds(address);
    const tokens = useTokenURIs(a);
    const myTokens = useTokenURIs(b);

    const {data: totalSupply} = useTotalSupply();
    const {data: maxSupply} = useMaxSupply();
    const [selectedToken, setSelectedToken] = useState(undefined);


    if (isLoading) return (
        <Loader/>
    )

    const prettyAddress = address ? address.slice(0, 6) + '...' + address.slice(-4) : null

    return (
        <div className="sm:p-12 relative select-none h-full w-full p-0 m-0">
            <header className="w-full max-w-[1639px] sticky top-0 left-0 right-0 m-auto z-50">
                <div className="mx-auto bg-black">
                    {/* --- Mobile (<= sm) : barre compacte --- */}
                    <div className="flex items-center justify-between h-14 sm:hidden">
                        <button
                            type="button"
                            aria-label="Ouvrir le menu"
                            className="flex items-start"
                        >
                            <Placeholder scale={5}/>
                        </button>

                        <div className="flex items-center gap-2">
                            <Logo scale={6}/>
                            <span className="text-base font-semibold pixel-font-2 leading-none">TTR</span>
                        </div>

                        <div className="flex items-center cursor-pointer">
                            <Wallet/>
                        </div>
                    </div>

                    {/* --- Desktop (>= sm) : grille 3 colonnes --- */}
                    <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 items-center">
                        {/* Colonne gauche : marque */}
                        <div className="flex items-center justify-start gap-4">
                            <Placeholder scale={7}/>
                            <div className="leading-tight">
                                <p className="text-lg lg:text-xl pixel-font-2">The</p>
                                <p className="text-lg lg:text-xl pixel-font-2">Turtlets</p>
                                <p className="text-lg lg:text-xl pixel-font-2">Season one - The bay</p>
                            </div>
                        </div>

                        {/* Colonne centre : logo */}
                        <div className="flex items-center justify-center">
                            <Logo scale={7}/>
                        </div>

                        {/* Colonne droite : wallet */}
                        <div className="flex items-center justify-end cursor-pointer">
                            {
                                isConnected ?
                                    <div className={'flex flex-row items-center justify-end gap-4'}>
                                        <p className={'pixel-font-2 text-white'}>{prettyAddress}</p>
                                        <Logout/>
                                    </div>
                                    :
                                    <Wallet/>
                            }
                        </div>
                    </div>
                </div>
            </header>
            <section className="py-16 px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white pixel-font-2">
                    A Reef with a Purpose 🌍
                </h2>
                <p className="pixel-font-2 mt-6 max-w-3xl mx-auto text-white leading-relaxed">
                    The Turtlets is a living story where each chapter
                    brings new clans, rare hybrids, and legendary Tortlets. Beyond the pixels, every mint fuels
                    a real mission: <span style={{color: 'rgb(0, 133, 255)'}} className="font-semibold">supporting ocean preservation foundations </span>
                    fighting to protect marine life and habitats.
                </p>
                <p style={{color: 'rgb(0, 133, 255)'}} className="pixel-font-2 mt-4 max-w-3xl mx-auto text-white/70 leading-relaxed">
                    It’s a symbol of migration, evolution,
                    and survival. both in the Reef, and in the oceans we share 🩵
                </p>
            </section>

            <div className={'h-full w-full'}>
                <div className="flex flex-col items-center justify-center h-full text-white">
                    <div
                        className={'w-full max-w-[1639px] flex flex-row items-center flex-1 justify-between mb-8 text-center mt-8'}>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 p-4">
                            <div>
                                <p className={'pixel-font-2'}>Season completion</p>
                                <h1 className={'pixel-font-2 text-3xl'}>{(Number(tokens.length)/Number(260) * 100).toFixed(1)}%</h1>
                            </div>
                            <div>
                                <p className={'pixel-font-2'}>Turtlets saved</p>
                                <p className={'pixel-font-2 text-3xl'}>{totalSupply}/{maxSupply}</p>
                            </div>
                        </div>
                    </div>

                    <div className={'mb-8 w-full max-w-[1639px]'}>
                        <GridBG tokens={tokens} onItemClick={(index) => setSelectedToken(index)}/>
                    </div>
                    <div className={'flex flex-col items-start justify-start text-align-left mb-8 w-full max-w-[1639px]'}>
                        <p className={'pixel-font-2 text-3xl mb-8'}>My Turtlets</p>
                        {!myTokens.length && <div className={'flex flex-1 w-full flex-row items-center justify-center'}>
                            {isConnected && <p className="pixel-font-2 max-w-3xl mx-auto text-white/70 leading-relaxed text-align-center">
                                Start minting a Turtlet and help us saving the ocean 🩵
                            </p>}
                            {!isConnected && <p className="pixel-font-2 max-w-3xl mx-auto text-white/70 leading-relaxed text-align-center">
                                Connect your wallet 🩵
                            </p>}
                        </div>}
                        <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-4 max-w-5xl mx-auto mb-8'}>
                            {myTokens.map((dataUri, i) => {
                                if (!dataUri) return null;
                                return <NftViewer dataUri={dataUri}/>
                            })}
                        </div>
                    </div>
                    <div>
                        <a
                           className="flex pixel-font-3 text-3xl px-12 bg-white text-black items-center justify-center cursor-pointer hover:bg-black hover:text-white hover:ring-1 hover:ring-white h-[64px]">
                            <p>{`MINT ON MINTBAY`}</p>
                        </a>
                    </div>
                    {/*<div className={'flex flex-row items-center justify-center'}>
                        <Mint qty={nbMint}/>
                        <a onClick={addToMint}
                            className={'flex pixel-font-3 text-3xl bg-white text-black items-center justify-center cursor-pointer hover:bg-black hover:text-white hover:ring-1 hover:ring-white h-[64px] w-[64px]'}>
                            <Plus size={24} strokeWidth={3} />
                        </a>
                        <a onClick={removeToMint}
                            className={'flex pixel-font-3 text-3xl bg-white text-black items-center justify-center cursor-pointer hover:bg-black hover:text-white hover:ring-1 hover:ring-white h-[64px] w-[64px]'}>
                            <Minus size={24} strokeWidth={3} />
                        </a>
                    </div>*/}
                    {/*<p className={'pixel-font-3 text-2xl text-white mb-8'}>max supply : 260 - {(floor * nbMint).toFixed(5)} ETH</p>*/}
                    <div
                        className={'w-full max-w-[1639px] flex flex-row items-center flex-1 justify-between text-center'}>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-4">
                            <div>
                                <p className={'pixel-font-2'}>Meet</p>
                                <p className={'pixel-font-2 text-3xl'}>Turtlets</p>
                            </div>
                            <div>
                                <p className={'pixel-font-2'}>Unlock</p>
                                <p className={'pixel-font-2 text-3xl'}>New Traits</p>
                            </div>
                            <div>
                                <p className={'pixel-font-2'}>Support</p>
                                <p className={'pixel-font-2 text-3xl'}>Fair actions</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={'w-full max-w-[1639px] flex flex-row items-center flex-1 justify-between text-center'}>
                        <Slider
                            images={[...Array(100).keys()].map(i => '/turtlets/turtle_' + i + '.png')}
                            itemClass="h-24 w-24 md:h-28 md:w-28 mb-8"
                            gapClass="gap-3 md:gap-4"
                            speed={90}
                            direction={1}
                        />
                    </div>

                    <header className="w-full max-w-[1639px]">
                        <div className="mx-auto bg-black">
                            <div className="grid grid-cols-3 items-center mb-8">
                                {/* Colonne gauche : marque */}
                                <div className="flex items-center justify-start gap-4">
                                    <PlaceholderEp2 scale={5}/>
                                    <div className="leading-tight">
                                        <p className="text-lg lg:text-xl pixel-font-2 text-white/56">The</p>
                                        <p className="text-lg lg:text-xl pixel-font-2 text-white/56">Turtlets</p>
                                        <p className="text-lg lg:text-xl pixel-font-2 text-white/56">Season two - The
                                            reef</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <p className={'pixel-font-2 text-white/56'}>Coming next</p>
                                </div>
                                <div className="flex items-center justify-end cursor-pointer">
                                    <Locked/>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center mb-8">
                                <div className="flex items-center justify-start gap-4">
                                    <PlaceholderEp3 scale={5}/>
                                    <div className="leading-tight">
                                        <p className="text-lg lg:text-xl pixel-font-2 text-white/56">The</p>
                                        <p className="text-lg lg:text-xl pixel-font-2 text-white/56">Turtlets</p>
                                        <p className="text-lg lg:text-xl pixel-font-2 text-white/56">Season three - The
                                            sea</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <p className={'pixel-font-2 text-white/56'}>Coming next</p>
                                </div>
                                <div className="flex items-center justify-end cursor-pointer">
                                    <Locked/>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
                <section className="px-6 pixel-font-2" style={{backgroundColor: 'rgb(0, 133, 255)'}}>
                    <div
                        className="p-6 text-center"
                    >
                        <p className="pixel-font-2 text-lg text-black">{new Date().getFullYear()}. Made from 🌊 by 0xKeinno</p>
                    </div>
                </section>
            </div>
            <RightDrawer isOpen={selectedToken !== undefined} setIsOpen={setSelectedToken}>
                <div className={'h-[300px] w-[300px]'}>
                    <NftViewer dataUri={tokens[selectedToken]}/>
                </div>
            </RightDrawer>
        </div>
    )
}

export default App
