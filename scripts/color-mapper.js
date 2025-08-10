// hue-rotate-svg-lch-modes.js
// Usage :
//   node hue-rotate-svg-lch-modes.js input.svg outdir --mode 1 --shift 40
//   node hue-rotate-svg-lch-modes.js input.svg outdir --mode 2 --sweep 20
//
// mode 1 = plus foncé (réduction Lightness)
// mode 2 = Lightness identique (script précédent)

import fs from 'fs';
import path from 'path';
import chroma from 'chroma-js';

const normHue = h => ((h % 360) + 360) % 360;

/** Hue shift LCH avec 2 modes */
function shiftHueLCH(color, deltaDeg, mode = 2) {
    const c = chroma(color);
    const a = c.alpha();
    let [L, C, H] = c.lch();
    if (!Number.isFinite(H)) H = 0; // achromatique

    // mode 1 = plus foncé → on réduit la L
    if (mode === 1) {
        L = Math.max(L - 30, 0); // réduction Lightness (ajuste -15 si besoin)
    }
    // mode 2 = Lightness conservée → rien à changer

    const Ht = normHue(H + deltaDeg);

    // tentative avec C d'origine
    let out = chroma.lch(L, C, Ht);

    // si ça clippe, on réduit C pour garder L constant
    if (out.clipped()) {
        let lo = 0, hi = C;
        for (let i = 0; i < 22; i++) {
            const mid = (lo + hi) / 2;
            (chroma.lch(L, mid, Ht).clipped()) ? hi = mid : lo = mid;
        }
        out = chroma.lch(L, lo, Ht);
    }

    out = out.alpha(a);
    return a < 1 ? out.css() : out.hex();
}

function replaceColorsWithHueShiftLCH(svgText, deltaDeg, mode) {
    // 1) Attributs SVG
    const ATTRS = ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'];
    for (const attr of ATTRS) {
        const re = new RegExp(`(${attr}\\s*=\\s*")(?!")(.*?)(")`, 'gi');
        svgText = svgText.replace(re, (m, p1, val, p2) => {
            const v = String(val).trim();
            if (!v || v === 'none' || v.startsWith('url(') || v === 'currentColor' || v.startsWith('var(')) return m;
            try {
                const out = shiftHueLCH(v, deltaDeg, mode);
                return `${p1}${out}${p2}`;
            } catch {
                return m;
            }
        });
    }

    // 2) Styles inline
    const styleRe = /(style\s*=\s*")([^"]+)(")/gi;
    svgText = svgText.replace(styleRe, (m, p1, body, p3) => {
        const decls = body
            .split(';')
            .map(s => s.trim())
            .filter(Boolean)
            .map(d => {
                const i = d.indexOf(':');
                if (i === -1) return d;
                const k = d.slice(0, i).trim();
                const v = d.slice(i + 1).trim();
                if (
                    ['fill'].includes(k) &&
                    v !== 'none' && !v.startsWith('url(') && v !== 'currentColor' && !v.startsWith('var(')
                ) {
                    try { return `${k}:${shiftHueLCH(v, deltaDeg, mode)}`; } catch { return d; }
                }
                return d;
            });
        return `${p1}${decls.join('; ')}${p3}`;
    });

    // 3) CSS interne <style>...</style>
    const styleBlockRe = /(<style[^>]*>)([\s\S]*?)(<\/style>)/gi;
    svgText = svgText.replace(styleBlockRe, (m, open, css, close) => {
        const tokenRe = /(#(?:[0-9a-f]{3,8}))|((?:rgb|hsl)a?\([^()]*\))/gi;
        const replaced = css.replace(tokenRe, (tok) => {
            try { return shiftHueLCH(tok, deltaDeg, mode); } catch { return tok; }
        });
        return `${open}${replaced}${close}`;
    });

    return svgText;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseArgs() {
    const args = process.argv.slice(2);
    const inputPath = args[0];
    const outDir = args[1];
    let shift = null;
    let sweep = null;
    let mode = 2;

    for (let i = 2; i < args.length; i++) {
        if (args[i] === '--shift') { shift = parseFloat(args[i + 1]); i++; }
        else if (args[i] === '--sweep') { sweep = parseFloat(args[i + 1]); i++; }
        else if (args[i] === '--mode') { mode = parseInt(args[i + 1]); i++; }
    }
    return { inputPath, outDir, shift, sweep, mode };
}

async function main() {
    const { inputPath, outDir, shift, sweep, mode } = parseArgs();
    if (!inputPath || !outDir || (shift == null && sweep == null)) {
        console.error('Usage :');
        console.error('  node hue-rotate-svg-lch-modes.js input.svg outdir --mode 1 --shift 40');
        console.error('  node hue-rotate-svg-lch-modes.js input.svg outdir --mode 2 --sweep 20');
        process.exit(1);
    }

    const svg = fs.readFileSync(inputPath, 'utf8');
    ensureDir(outDir);
    const base = path.basename(inputPath, path.extname(inputPath));

    if (shift != null) {
        const outText = replaceColorsWithHueShiftLCH(svg, shift, mode);
        const outPath = path.join(outDir, `${base}-lch-m${mode}-shift-${normHue(shift)}.svg`);
        fs.writeFileSync(outPath, outText, 'utf8');
        console.log('→', outPath);
        return;
    }

    if (sweep != null) {
        for (let h = 0; h < 360; h += sweep) {
            const outText = replaceColorsWithHueShiftLCH(svg, h, mode);
            const outPath = path.join(outDir, `${base}-lch-m${mode}-shift-${normHue(h)}.svg`);
            fs.writeFileSync(outPath, outText, 'utf8');
            console.log('→', outPath);
        }
    }
}

main().catch(e => { console.error(e); process.exit(1); });
