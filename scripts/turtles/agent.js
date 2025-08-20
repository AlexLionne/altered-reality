import path from "path";
import {fileURLToPath} from 'url';
import {createCanvas, loadImage} from 'canvas';
import fs from 'fs';
import {randomInt} from "crypto";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function oneIn(x) {
    if (!Number.isInteger(x) || x <= 0) throw new Error("x entier > 0");
    return randomInt(0, x) === 0;
}

const colorsNumber = 14
const head = path.join(__dirname, './res/head/head.svg')
const body = path.join(__dirname, './res/body/body.svg')
const background = path.join(__dirname, './res/background/background.svg')
const eyes = path.join(__dirname, './res/eyes/eyes.svg')
const feet = path.join(__dirname, './res/feet/feet.svg')
const hands = path.join(__dirname, './res/hands/hands.svg')
const tail = path.join(__dirname, './res/tail/tail.svg')
const carapace = path.join(__dirname, './res/carapace/carapace.svg')
const palette = path.join(__dirname, './res/palette.png')

const metadata = []
// ensure that body color is different tint as bg

const getCarapaceModifiers = async (carapaceColor) => {
    return [
        ['red', adjustLightness(carapaceColor, 60)],
        ['green', adjustLightness(carapaceColor, 55)],
    ]
}

const getBodyModifiers = async (bodyStyle, bodyColor, backgroundColor) => {
    const palette = await getPalette()
    if (bodyColor === backgroundColor) return await getBodyModifiers(bodyStyle, bodyColor, adjustLightness(palette[randomInt(0, colorsNumber)], 90))

    switch (bodyStyle) {
        case 0:
            return [
                ['red', bodyColor],
                ['green', bodyColor],
                ['blue', bodyColor],
                ['pink', bodyColor],
                ['yellow', bodyColor],
            ]
        case 1:
            return [
                ['red', bodyColor],
                ['green', adjustLightness(bodyColor, 100)],
                ['blue', adjustLightness(bodyColor, 100)],
                ['pink', adjustLightness(bodyColor, 100)],
                ['yellow', bodyColor],
            ]
        case 2:
            return [
                ['red', bodyColor],
                ['green', bodyColor],
                ['blue', bodyColor],
                ['pink', bodyColor],
                ['yellow', bodyColor],
            ]
    }
}
const getSurfModifiers = async (backgroundColor) => {
    return [
        ['pink', adjustLightness(backgroundColor, 60)],
        ['red', adjustLightness(backgroundColor, 50)],
        ['blue', adjustLightness(backgroundColor, 70)],
        ['green', adjustLightness(backgroundColor, 80)],
        ['yellow', adjustLightness(backgroundColor, 90)],
    ]
}

const getEyesModifiers = async (color, headModifiers) => {
    const hasCustomEyes = oneIn(3)
    const hasBlack = headModifiers[1][1] === '#000000' || headModifiers[0][1] === '#000000' || headModifiers[2][1] === '#000000'
    const hasWhite = headModifiers[1][1] === '#ffffff' || headModifiers[0][1] === '#ffffff' || headModifiers[2][1] === '#ffffff'
    if (hasBlack) color = '#ffffff'
    if (hasWhite) color = '#000000'

    if (hasCustomEyes) {
        return [['black', color]]
    }

    return [['black', hasBlack ? 'white' : 'black']]
}

const getHeadModifiers = async (base) => {
    const palette = await getPalette()
    const hasHeaded = oneIn(10)
    const hasMask = oneIn(20)
    const hasHeadGradient = oneIn(10)
    const color = randomInt(0, colorsNumber)

    if (base === '#ffffff') return await getHeadModifiers(palette[color])
    if (hasHeadGradient) {
        return [
            ['red', adjustLightness(base, 80)],
            ['green', adjustLightness(base, 75)],
            ['blue', adjustLightness(base, 70)]
        ]
    }

    if (hasMask) {
        let tint = adjustLightness(base, 50)
        const sameTint = oneIn(10)
        if (!sameTint)
            tint = palette[color]
        return [
            ['red', tint],
            ['green', tint],
            ['blue', base],
        ]
    }

    if (hasHeaded) {
        return [
            ['red', base],
            ['green', adjustLightness(base, 75)],
            ['blue', base],
        ]
    }

    return [
        ['red', base],
        ['green', base],
        ['blue', base],
    ]
}

const getPalette = async () => {
    let [x, y] = [8, 2]
    let colors = []
    for (const column of [...Array(x).keys()]) {
        for (const row of [...Array(y).keys()]) {
            colors.push(await getPixelColor(palette, column, row))
        }
    }
    return colors
}

const getBackgroundColorIndex = (baseIndex) => {
    const color = randomInt(3, colorsNumber)
    if (baseIndex === color) {
        return getBackgroundColorIndex(baseIndex)
    }
    return color
}

(async () => {
    const size = 16;
    const name = 'turtle'
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const colors = await getPalette()
    for (const a in [...Array(1000).keys()]) {

        let metadata = {
            head: {
                gradient_head: false,
                dual_tones: false,
                mask: false,
            },
            expression: {
                neutral: false,
                shouting: false,
                smiling: false,
                crying: false,
            },
            body: {
                dual_tones: false,
                neutral: false,
                striped: false,
            },
            hat: {
                neutral: false,
                cap: false,
                bandana: false,
            },
            eyes: {
                neutral: false,
                white: false,
                glasses: false,
                glasses_gradient: false,
            },
            carapace: {
                neutral: false,
            },
            background: {
                flat: false
            },
            crown: false,
            lazr: false,
            surf: false
        }
        const isDualTones = oneIn(20)
        const baseColorIndex = randomInt(3, colorsNumber)
        const baseBackgroundIndex = getBackgroundColorIndex(baseColorIndex)
        const dualToneColorIndex = getBackgroundColorIndex(baseBackgroundIndex)

        const carapaceColor = colors[baseBackgroundIndex]
        const headModifiers = await getHeadModifiers(colors[baseColorIndex])
        const eyesColor = oneIn(10) || headModifiers[0][1] === '#000000' ? 'white' : adjustLightness(colors[baseBackgroundIndex], 10)

        const bodyStyle = randomInt(0, 3)
        const bodyColor = adjustLightness(colors[baseColorIndex], 90)
        const baseColor = adjustLightness(colors[baseColorIndex], 70)
        const backgroundColor = adjustLightness(carapaceColor, 95)
        const hatColor = adjustLightness(carapaceColor, 50)
        const dualToneColor = colors[dualToneColorIndex]
        // mandatory parts
        const hasCrown = oneIn(5)
        const hasEgg = oneIn(15000)
        const hasMouth = oneIn(3)
        const isCrying = oneIn(1000)
        const hasLazr = oneIn(100)
        const mouthStyle = randomInt(0, 3)
        const hasGlasses = oneIn(30)
        const hasGlassesGradient = oneIn(2)
        const hasWater = oneIn(10)
        const hasSurf = oneIn(10)
        const hasBandana = oneIn(5)
        const hairType = randomInt(1, 3)
        const hasHat = oneIn(20)
        const hatType = randomInt(1, 3)

        // accessories
        let crown = path.join(__dirname, './res/accessories/crown.svg')
        let egg = path.join(__dirname, './res/accessories/egg.svg')
        let mouth = path.join(__dirname, './res/accessories/mouth.svg')
        let crying = path.join(__dirname, './res/accessories/crying.svg')
        let lazr = path.join(__dirname, './res/accessories/lazr.svg')
        let dualToneHead = path.join(__dirname, './res/accessories/dual_tones_head.svg')
        let dualTonBody = path.join(__dirname, './res/accessories/dual_tones_body.svg')
        let glasses = path.join(__dirname, './res/accessories/glasses.svg')
        let glassesGradient = path.join(__dirname, './res/accessories/glasses_gradient.svg')
        let bandana = path.join(__dirname, './res/accessories/bandana.svg')
        let hat = path.join(__dirname, './res/accessories/hat.svg')
        let surf = path.join(__dirname, './res/accessories/surf.svg')
        let water = path.join(__dirname, './res/accessories/water.svg')
        // colors

        // traits
        ctx.drawImage(await colorize(background, [['red', backgroundColor]]), 0, 0)
        ctx.drawImage(await colorize(
            head,
            headModifiers
        ), 7, 6)

        ctx.drawImage(await colorize(eyes, await getEyesModifiers(eyesColor, headModifiers)), 8, 7)
        if (hasGlasses) {
            if (hasGlassesGradient) {
                ctx.drawImage(await colorize(glassesGradient, [['red', adjustLightness(bodyColor, 20)], ['green', adjustLightness(carapaceColor, 90)]]), 8, 7)
            } else {
                ctx.drawImage(await colorize(glasses, [['red', 'black']]), 8, 7)
            }
        }

        hasSurf && ctx.drawImage(await colorize(surf, await getSurfModifiers(backgroundColor)), 0, 9)

        ctx.drawImage(await colorize(body, await getBodyModifiers(bodyStyle, bodyColor, backgroundColor)), 7, 9)
        if (isDualTones) ctx.drawImage(await colorize(dualToneHead, [['red', dualToneColor]]), 9, 6)
        if (isDualTones) ctx.drawImage(await colorize(dualTonBody, [['red', adjustLightness(dualToneColor, 90)]]), 9, 9)

        ctx.drawImage(await colorize(hands, [
            ['red', adjustLightness(baseColor, 70)],
        ]), 7, 10)
        ctx.drawImage(await colorize(feet, [
            ['red', adjustLightness(baseColor, 50)],
        ]), 6, 11)

        ctx.drawImage(await colorize(carapace, await getCarapaceModifiers(carapaceColor)), 5, 7)

        ctx.drawImage(await colorize(tail, [
            ['red', adjustLightness(baseColor, 40)],
            ['green', adjustLightness(baseColor, 40)],
            ['blue', adjustLightness(baseColor, 40)],
        ]), 4, 9)
        //

        if (hasEgg) {
            let eggColor = carapaceColor
            ctx.drawImage(await colorize(egg, [
                ['red', adjustLightness(eggColor, 75)],
                ['green', adjustLightness(eggColor, 65)],
            ]), 4, 5)
        }
        if (hasCrown) {
            let crownColor = colors[randomInt(3, colorsNumber)]
            ctx.drawImage(await colorize(crown, [
                ['red', adjustLightness(crownColor, 70)],
                ['green', adjustLightness(crownColor, 40)],
            ]), 7, 4)
        }

        if (hasMouth) {
            const mouthColor = "#FFB1D6"
            switch (mouthStyle) {
                case 0:
                    ctx.drawImage(await colorize(mouth, [
                        ['red', 'transparent'],
                        ['green', mouthColor],
                    ]), 9, 8)
                    break;
                case 1:
                    ctx.drawImage(await colorize(mouth, [
                        ['red', mouthColor],
                        ['green', mouthColor],
                    ]), 9, 8)
                    break;
                case 2:
                    ctx.drawImage(await colorize(mouth, [
                        ['red', mouthColor],
                        ['green', 'transparent'],
                    ]), 9, 8)
            }
        }
        //hasWater && ctx.drawImage(await colorize(water, [['red', '#69DFFF']]), 9, 8)

        if (isCrying) {
            ctx.drawImage(await loadImage(crying), 7, 8)
        } else if (hasLazr) {
            ctx.drawImage(await loadImage(lazr), 8, 7)
        }
        if (hasBandana && !hasCrown && !hasHat) {
            let hairColor = colors[randomInt(0, colorsNumber)]
            switch (hairType) {
                case 1:
                    ctx.drawImage(await colorize(bandana, [
                        ['red', adjustLightness(hairColor, 30)],
                    ]), 6, 6)
                    break;
                case 2:
                    ctx.drawImage(await colorize(bandana, [
                        ['red', adjustLightness(hairColor, 30)],
                    ]), 6, 6)
                    break;
                case 3:
                    ctx.drawImage(await colorize(bandana, [
                        ['red', adjustLightness(hairColor, 30)],
                    ]), 6, 6)
                    break;
            }
        }

        if (!hasCrown && hasHat) {
            console.log('hatType', hatType)
            switch (hatType) {
                case 1:
                    ctx.drawImage(await colorize(hat, [
                        ['red', adjustLightness(hatColor, 60)],
                        ['blue', adjustLightness(hatColor, 65)],
                        ['green', 'transparent'],
                        ['yellow', 'transparent'],
                    ]), 6, 4)
                    break;
                case 2:
                    ctx.drawImage(await colorize(hat, [
                        ['red', adjustLightness(hatColor, 60)],
                        ['green', adjustLightness(hatColor, 60)],
                        ['blue', adjustLightness(hatColor, 65)],
                        ['yellow', adjustLightness(hatColor, 65)],
                    ]), 6, 4)
                    break;
            }
        }
        const inputPath = path.join(__dirname, `./outputs/${name}_${a}.png`);
        const outPath = path.join(__dirname, `./outputs/${name}.svg`);
        const out = fs.createWriteStream(inputPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        out.on('finish', async () => {
            console.log('✅ Image masquée enregistrée', a)
            await generateSvg(inputPath, outPath)
            const canvas = createCanvas(2048, 2048);
            const ctx = canvas.getContext('2d');

            ctx.drawImage(await loadImage(outPath), 0, 0)
            const out = fs.createWriteStream(inputPath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
        });
    }
    await new Promise((resolve => setTimeout(resolve, 300)))
})();

async function colorize(path, modifiers) {
    let elem = fs.readFileSync(path, "utf8");
    for (const [original, color] of modifiers) {
        const safeOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(safeOriginal, "gi");
        elem = elem.replace(regex, () => color);
    }
    const buffer = await sharp(Buffer.from(elem)).toBuffer()
    return await loadImage(buffer)
}

async function getPixelColor(path, x, y) {
    const {data, info} = await sharp(path)
        .extract({left: x, top: y, width: 1, height: 1})
        .raw()
        .toBuffer({resolveWithObject: true});

    const [r, g, b] = data;
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`
}


function adjustLightness(hex, newLightness) {
    // Convert HEX → RGB
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(x => x + x).join("");
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60;
    }

    // appliquer la nouvelle lightness (0-100)
    l = newLightness / 100;

    // reconvertir en RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let R, G, B;
    if (h < 60) {
        R = c;
        G = x;
        B = 0;
    } else if (h < 120) {
        R = x;
        G = c;
        B = 0;
    } else if (h < 180) {
        R = 0;
        G = c;
        B = x;
    } else if (h < 240) {
        R = 0;
        G = x;
        B = c;
    } else if (h < 300) {
        R = x;
        G = 0;
        B = c;
    } else {
        R = c;
        G = 0;
        B = x;
    }

    R = Math.round((R + m) * 255);
    G = Math.round((G + m) * 255);
    B = Math.round((B + m) * 255);

    return "#" + [R, G, B].map(x => x.toString(16).padStart(2, "0")).join("");
}

const generateSvg = async (inputPath, outputPath) => {
    const size = 16;           // taille originale
    const scale = 2048 / size; // facteur d'agrandissement

    // Récupère les pixels
    const image = sharp(inputPath).resize(size, size);
    const {data} = await image.raw().toBuffer({resolveWithObject: true});

    // Commence le SVG avec la taille finale
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${2048}" height="${2048}" viewBox="0 0 ${2048} ${2048}">\n`;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            const [r, g, b, a] = data.slice(i, i + 4);

            if (a > 0) {
                const fill = `rgba(${r},${g},${b},${(a / 255).toFixed(2)})`;

                // Agrandit le rectangle par le facteur scale
                svg += `  <rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${fill}" />\n`;
            }
        }
    }

    svg += `</svg>\n`;

    fs.writeFileSync(outputPath, svg);
    console.log(`✅ SVG saved to ${outputPath}`);
};