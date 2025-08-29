import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Marquee continu (JS pur React, SANS plugin GSAP)
 * - 2 pistes identiques rendues en JSX (pas de DOM impératif)
 * - Vitesse stable en px/s via requestAnimationFrame (pas de saccades)
 * - Pause au survol
 * - Réactif (ResizeObserver)
 *
 * Astuce: `direction=1` fait défiler le contenu vers la gauche (visuellement
 * les images se déplacent de droite → gauche). Mettez `-1` pour l'inverse.
 */
export default React.memo(Slider, (prev, next) => true);
function Slider({
                           images = [],
                           className = "",
                           itemClass = "h-24 w-24 md:h-28 md:w-28",
                           gapClass = "gap-3 md:gap-4",
                           speed = 30, // px/s — plus petit = plus lent
                           direction = 1, // 1 = vers la gauche, -1 = vers la droite
                           padding = true,
                       }) {
    const viewportRef = useRef(null);
    const aRef = useRef(null);
    const bRef = useRef(null);
    const rafRef = useRef(0);
    const lastRef = useRef(0);
    const xARef = useRef(0);
    const xBRef = useRef(0);
    const wRef = useRef(0);
    const pausedRef = useRef(false);
    const [ready, setReady] = useState(false);

    // helper pour appliquer les transforms
    const apply = () => {
        if (aRef.current) aRef.current.style.transform = `translate3d(${xARef.current}px,0,0)`;
        if (bRef.current) bRef.current.style.transform = `translate3d(${xBRef.current}px,0,0)`;
    };

    // Mesure + positionnement initial
    const layout = () => {
        const a = aRef.current;
        const viewport = viewportRef.current;
        if (!a || !viewport) return;
        // largeur d'une piste (incluant gaps/padding internes)
        const w = a.scrollWidth;
        if (!w) return;
        wRef.current = w;
        xARef.current = 0;
        xBRef.current = w * (direction === 1 ? 1 : -1);
        apply();
        setReady(true);
    };

    // Animation
    const step = (t) => {
        if (pausedRef.current) {
            lastRef.current = t;
            rafRef.current = requestAnimationFrame(step);
            return;
        }
        if (!lastRef.current) lastRef.current = t;
        const dt = (t - lastRef.current) / 1000; // secondes
        lastRef.current = t;

        const vx = Math.max(5, speed) * (direction === 1 ? -1 : 1); // px/s
        const W = wRef.current || 1;

        xARef.current += vx * dt;
        xBRef.current += vx * dt;

        // wrap simple: lorsqu'une piste a totalement quitté l'écran d'un côté,
        // on la replace APRÈS l'autre piste pour garder un ruban continu.
        if (vx < 0) {
            if (xARef.current <= -W) xARef.current += W * 2;
            if (xBRef.current <= -W) xBRef.current += W * 2;
        } else {
            if (xARef.current >= W) xARef.current -= W * 2;
            if (xBRef.current >= W) xBRef.current -= W * 2;
        }

        apply();
        rafRef.current = requestAnimationFrame(step);
    };

    useLayoutEffect(() => {
        // (re)layout après montage et quand `images` changent
        const id = requestAnimationFrame(() => layout());
        return () => cancelAnimationFrame(id);
    }, [images]);

    useEffect(() => {
        if (!ready) return;
        // lancer la boucle
        lastRef.current = 0;
        rafRef.current = requestAnimationFrame(step);

        // pause au survol
        const vp = viewportRef.current;
        const onEnter = () => (pausedRef.current = true);
        const onLeave = () => (pausedRef.current = false);
        vp?.addEventListener("mouseenter", onEnter);
        vp?.addEventListener("mouseleave", onLeave);

        // responsive
        const ro = new ResizeObserver(() => {
            // remesure propre et reset positions
            layout();
        });
        if (vp) ro.observe(vp);

        // cleanup
        return () => {
            cancelAnimationFrame(rafRef.current);
            vp?.removeEventListener("mouseenter", onEnter);
            vp?.removeEventListener("mouseleave", onLeave);
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, speed, direction]);

    // S'assure que les images chargées provoquent un recalcul
    useEffect(() => {
        const imgs = Array.from((viewportRef.current || document).querySelectorAll("img[data-marquee]")).slice(0, images.length);
        let pending = imgs.length;
        if (!pending) return;
        const onLoad = () => {
            pending -= 1;
            if (pending <= 0) layout();
        };
        imgs.forEach((img) => {
            if (img.complete) pending -= 1;
            else img.addEventListener("load", onLoad);
        });
        if (pending <= 0) layout();
        return () => imgs.forEach((img) => img.removeEventListener("load", onLoad));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images]);

    return (
        <div ref={viewportRef} className={"w-full overflow-hidden " + className}>
            <div className={(padding ? "p-4 " : "") + "relative"}>
                <div className={itemClass} style={{ visibility: "hidden" }} aria-hidden="true" />
                {/* Piste A */}
                <div ref={aRef} className={"absolute left-0 top-0 flex items-center " + gapClass}>
                    {images.map((src, i) => (
                        <div key={"a-" + i} className={"shrink-0 overflow-hidden " + itemClass}>
                            <img
                                data-marquee
                                src={src}
                                alt=""
                                className="h-full w-full object-cover"
                                draggable={false}
                                loading={i > 6 ? "lazy" : "eager"}
                            />
                        </div>
                    ))}
                </div>
                {/* Piste B (clone JSX) */}
                <div ref={bRef} className={"absolute left-0 top-0 flex items-center " + gapClass}>
                    {images.map((src, i) => (
                        <div key={"b-" + i} className={"shrink-0 overflow-hidden " + itemClass}>
                            <img
                                data-marquee
                                src={src}
                                alt=""
                                className="h-full w-full object-cover"
                                draggable={false}
                                loading={i > 6 ? "lazy" : "eager"}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}