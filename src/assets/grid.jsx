import React, { useEffect, useRef, useState } from "react";

export const GridBG = ({tokens, cols = 26, rows = 10, onItemClick}) => {
    const COLS = 26;
    const ROWS = 10;

    tokens = tokens.slice(0, cols * rows);
    const wrapperRef = useRef(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const ro = new ResizeObserver(([entry]) => {
            const cr = entry.contentRect;
            setSize({ w: Math.floor(cr.width), h: Math.floor(cr.height) });
        });

        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // fallback si pas encore de taille
    const cell =
        size.w > 0 && size.h > 0
            ? Math.max(size.w / COLS, size.h / ROWS)
            : 64;

    const svgW = cell * COLS;
    const svgH = cell * ROWS;

    return (
        <div
            className={'border-1 border-white/30'}
            ref={wrapperRef}
            style={{ width: '100%', height: '100%', backgroundColor: '#0085FF' }}
        >
            <svg
                width={'100%'}
                height={'100%'}
                viewBox={`0 0 ${svgW} ${svgH}`}
                xmlns="http://www.w3.org/2000/svg"
                shapeRendering="crispEdges"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    {tokens.slice(0, cols * rows).map((dataUri, i) => {
                        if (!dataUri) return null;

                        try {
                            const base64 = dataUri.split(",")[1];
                            const jsonStr = atob(base64);
                            const metadata = JSON.parse(jsonStr);

                            // URI de l’image (peut être `image_data` ou `image`)
                            const imageUri = metadata.image_data || metadata.image;
                            if (!imageUri) return null;

                            return (
                                <pattern
                                    key={i}
                                    id={`nft-${i}`}
                                    patternUnits="objectBoundingBox"
                                    width="100%"
                                    height="100%"
                                >
                                    <image
                                        href={imageUri}
                                        width={cell}
                                        height={cell}
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                </pattern>
                            );
                        } catch (e) {
                            console.error("Decode error", e);
                            return null;
                        }
                    })}
                </defs>
                {/* Cases de la grille */}
                {Array.from({ length: cols * rows }).map((_, i) => {
                    const c = i % cols;
                    const r = Math.floor(i / cols);
                    const x = c * cell;
                    const y = r * cell;

                    return (
                        <rect
                            onClick={() => {
                                onItemClick(i)
                            }}
                            key={i}
                            x={x}
                            y={y}
                            width={cell}
                            height={cell}
                            fill={`url(#nft-${i})`}
                            stroke="white"
                            strokeOpacity="0.3"
                        />
                    );
                })}
            </svg>
        </div>
    );
};
