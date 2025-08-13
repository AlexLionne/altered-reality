import puppeteer from "puppeteer";
import path from "path";
import {fileURLToPath} from 'url';
import {createCanvas, loadImage} from 'canvas';
import fs from 'fs';
import sharp from "sharp";
import {randomInt} from "crypto";
import OpenAI from "openai";
import {randomizeElementColor} from "./color-mapper.js";

const client = new OpenAI({
    apiKey: "",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000,  // Override default timeout with longer timeout for reasoning models
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function oneIn(x) {
    if (!Number.isInteger(x) || x <= 0) throw new Error("x entier > 0");
    return randomInt(0, x) === 0;
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
    });

    // { headless: false } si tu veux voir le navigateur
    const page = await browser.newPage();

    const query = `?type=2`

    const generateAsset = async (batch) => {
        await page.evaluate(() => {
            const input = document.querySelector('#export-button');
            input && input.click()
        });

        await wait(3000)
        await page.goto('https://moshpro.app/lite/');
        const file = await getLastModifiedFile(path.join(__dirname, '../../../../Downloads'))

        const filePath = path.resolve(path.join(__dirname, '../../../../Downloads', file));
        const input = await page.waitForSelector('#file-input');
        await input.uploadFile(filePath);
        await page.evaluate(() => {
            const elements = [...document.querySelectorAll('div')];
            const target = elements.find(el => el.textContent.trim() === 'Pixelate');
            if (target) target.click();
        });
        await wait(1000);

        await page.evaluate(() => {
            const input = document.querySelector('[aria-labelledby="lil-gui-name-1"]');
            input.click()
        });
        await wait(300);

        await page.evaluate(() => {
            const input = document.querySelector('input[aria-labelledby="lil-gui-name-2"]');
            if (input) input.value = '';
        });
        await wait(300);
        await page.evaluate(() => {
            const input = document.querySelector('input[aria-labelledby="lil-gui-name-3"]');
            if (input) input.value = '';
        });
        await wait(300);
        await page.type('[aria-labelledby="lil-gui-name-2"]', "32");
        await wait(300);
        await page.type('[aria-labelledby="lil-gui-name-3"]', "32");
        await wait(300);


        // Extraire les données du canvas
        const dataUrl = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return canvas.toDataURL('image/png');
        });

        // Supprimer le préfixe 'data:image/png;base64,' pour convertir
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

        // Sauvegarder dans un fichier
        fs.writeFileSync(path.join(__dirname, `./uploads/${batch}.png`), base64Data, 'base64');
        await generateArt(batch)
    }

    for (let i = 0; i < 100; i++) {
        await page.goto(`http://localhost:5175/${query}`, {waitUntil: 'networkidle0'})
        await wait(3000)
        await generateAsset(i)
    }
    await browser.close();
})();


const generateArt = async (name, gender = 'female', type = 1) => {
    try {
        gender = oneIn(3) ? 'female' : 'male';

        const canvas = createCanvas(2048, 2048);
        const ctx = canvas.getContext('2d');
        const imagePath = path.join(__dirname, `./uploads/${name}.png`);
        const image = await loadImage(imagePath);

        const hasMaskModifier = oneIn(5);

        const isNeck = oneIn(10);
        const hasHeart = oneIn(50);
        const hasAura = oneIn(1000);
        const hasHead = oneIn(200);
        const hasMaskType = oneIn(1);
        const hasGlasses = oneIn(2);
        const hasSingleColor= oneIn(5);

        const eyesIndex = randomInt(0, 4);
        const headIndex = randomInt(0, 3);
        const glassesIndex = randomInt(0, 7);
        let maskIndex = randomInt(0, 10);

        const common = {
            heart: await loadImage(path.join(__dirname, './res/common/heart.svg')),
            masks: [
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_1.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_2.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_3.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_4.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_5.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_6.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_7.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_8.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_9.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/modifiers/mask_12.svg')),
                // await loadImage(path.join(__dirname, './res/common/mask/mask_10.svg')),
                // await loadImage(path.join(__dirname, './res/common/mask/mask_11.svg')),
                await loadImage(path.join(__dirname, './res/common/mask/mask_13.svg'))
            ],
            glasses: [
                await loadImage(path.join(__dirname, './res/common/glasses/glasses_1.svg')),
                await loadImage(path.join(__dirname, './res/common/glasses/glasses_2.svg')),
                await loadImage(path.join(__dirname, './res/common/glasses/glasses_3.svg')),
                await loadImage(path.join(__dirname, './res/common/glasses/glasses_4.svg')),
                await loadImage(path.join(__dirname, './res/common/glasses/glasses_5.svg')),
                await loadImage(path.join(__dirname, './res/common/glasses/glasses_6.svg')),
                //await loadImage(path.join(__dirname, './res/common/glasses/glasses_7.svg')),
                //await loadImage(path.join(__dirname, './res/common/glasses/glasses_8.svg')),
                await loadImage(path.join(__dirname, './res/common/glasses/glasses_9.svg')),
                await loadImage(path.join(__dirname, './res/common/glasses/glasses_10.svg'))
            ],
            heads: [
                await loadImage(path.join(__dirname, './res/common/head/head_2.svg')),
                await loadImage(path.join(__dirname, './res/common/head/head_3.svg')),
                await loadImage(path.join(__dirname, './res/common/head/head_4.svg')),
                await loadImage(path.join(__dirname, './res/common/head/head_5.svg')),
            ],
            eyes: [
                path.join(__dirname, './res/common/eyes/eyes_1.svg'),
                path.join(__dirname, './res/common/eyes/eyes_2.svg'),
                path.join(__dirname, './res/common/eyes/eyes_3.svg'),
                path.join(__dirname, './res/common/eyes/eyes_4.svg'),
                path.join(__dirname, './res/common/eyes/eyes_5.svg'),
                path.join(__dirname, './res/common/eyes/eyes_6.svg'),
                path.join(__dirname, './res/common/eyes/eyes_7.svg'),
                path.join(__dirname, './res/common/eyes/eyes_8.svg'),
                path.join(__dirname, './res/common/eyes/eyes_9.svg'),
                path.join(__dirname, './res/common/eyes/eyes_10.svg'),
                path.join(__dirname, './res/common/eyes/eyes_11.svg')
            ],
            modifiers: {
                colors: {
                    hair: true,
                    eyes: true,
                    glasses: true,
                    head: true,
                    heart: true,
                },
                masks: []
            }
        }

        const hero = {
            male: {
                mask: path.join(__dirname, './res/heroes/male/mask/mask.svg'),
                bald: path.join(__dirname, './res/heroes/male/head/bald.svg'),
                aura: await loadImage(path.join(__dirname, './res/heroes/male/aura/aura.svg')),
                naked: path.join(__dirname, './res/heroes/male/body/naked.svg'),
                neck: await loadImage(path.join(__dirname, './res/heroes/male/body/neck.svg')),
                hair: [
                    await loadImage(path.join(__dirname, './res/heroes/male/hair/hair_1.svg')),
                    await loadImage(path.join(__dirname, './res/heroes/male/hair/hair_2.svg')),
                    await loadImage(path.join(__dirname, './res/heroes/male/hair/hair_3.svg')),
                    await loadImage(path.join(__dirname, './res/heroes/male/hair/hair_4.svg')),
                    await loadImage(path.join(__dirname, './res/heroes/male/hair/hair_5.svg'))
                ],
                modifiers: {
                    masks: [
                        ...common.masks,
                    ],
                    head: [
                        await loadImage(path.join(__dirname, './res/heroes/male/modifiers/head_1.svg')),
                        await loadImage(path.join(__dirname, './res/heroes/male/modifiers/head_6.svg')),
                        await loadImage(path.join(__dirname, './res/heroes/male/modifiers/head_7.svg')),
                    ],
                }
            },
            female: {
                mask: path.join(__dirname, './res/heroes/female/mask/mask.svg'),
                aura: null,
                naked: null,
                hair: [
                    path.join(__dirname, './res/heroes/female/hair/hair.svg')
                ],
                modifiers: {
                    colors: {
                        hair: true
                    },
                    masks: [
                        common.masks[0],
                        common.masks[1],
                        common.masks[2],
                        common.masks[3],
                        common.masks[7],
                    ],
                    background: await loadImage(path.join(__dirname, './res/heroes/female/modifiers/background.svg')),
                    body: await loadImage(path.join(__dirname, './res/heroes/female/modifiers/body.svg')),
                }
            }
        }

        ctx.drawImage(image, 0, 0);

        if (hasMaskModifier) {
            maskIndex = randomInt(0, hero[gender].modifiers.masks.length - 1)
        }

        if (gender === 'male') {
            const isNaked = oneIn(100);
            const isBald = oneIn(10);
            const hasHair = oneIn(7);
            const hairIndex = randomInt(0, 4);

            ctx.drawImage(await loadImage(hero.male.mask), 192, 192, 1664, 1856);

            if (hasSingleColor) {
                const head = await randomizeElementColor(hero.male.bald, type)
                const buffer = await sharp(Buffer.from(head)).toBuffer();
                ctx.drawImage(await loadImage(buffer), 0, 0, 2048, 2048);
            }

            if (hasSingleColor) {
                const body = await randomizeElementColor(hero.male.naked, type)
                const buffer = await sharp(Buffer.from(body)).toBuffer();
                ctx.drawImage(await loadImage(buffer), 0, 0, 2048, 2048);
            }

            ctx.drawImage(await loadImage(common.eyes[eyesIndex]), 0, 0, 2048, 2048);
            hasAura && ctx.drawImage(hero.male.aura, 0, 0, 2048, 2048);
            hasHead && ctx.drawImage(common.heads[headIndex], 0, 0, 2048, 2048);
            isNaked && ctx.drawImage(await loadImage(hero.male.naked), 0, 0, 2048, 2048);
            isNeck && ctx.drawImage(hero.male.neck, 0, 0, 2048, 2048);
            hasHeart && ctx.drawImage(common.heart, 0, 0, 2048, 2048);
            if (isBald) ctx.drawImage(await loadImage(hero.male.bald), 0, 0, 2048, 2048);
            else hasMaskType && ctx.drawImage(common.masks[maskIndex], 0, 0, 2048, 2048);
            hasHair && ctx.drawImage(hero.male.hair[hairIndex], 0, 0, 2048, 2048);
        }

        if (gender === 'female') {
            const hairIndex = 0;
            const {r, g, b} = await getFirstPixelColor(imagePath)

            if (hasSingleColor) {
                const head = await randomizeElementColor(hero.male.bald, type)
                const buffer = await sharp(Buffer.from(head)).toBuffer();
                ctx.drawImage(await loadImage(buffer), 0, 0, 2048, 2048);
            }

            if (hasSingleColor) {
                const body = await randomizeElementColor(hero.male.naked, type)
                const buffer = await sharp(Buffer.from(body)).toBuffer();
                ctx.drawImage(await loadImage(buffer), 0, 0, 2048, 2048);
            }

            let background = fs.readFileSync(path.join(__dirname, './res/heroes/female/modifiers/background.svg'), "utf8");
            background = background.replace(/#000000/gi, `rgb(${r},${g},${b})`);
            let buffer = await sharp(Buffer.from(background)).toBuffer();
            const svg = await loadImage(buffer);

            ctx.drawImage(await loadImage(hero.female.mask), 0, 0, 2048, 2048);
            ctx.drawImage(hero.female.modifiers.body, 0, 0, 2048, 2048);
            hasMaskType && ctx.drawImage(hero.female.modifiers.masks[maskIndex], 0, 0, 2048, 2048);

            const hair = await randomizeElementColor(hero.female.hair[hairIndex], type)
            buffer = await sharp(Buffer.from(hair)).toBuffer();
            ctx.drawImage(await loadImage(buffer), 0, 0, 2048, 2048);
            ctx.drawImage(svg, 0, 0, 2048, 2048);
        }

        ctx.drawImage(await loadImage(common.eyes[eyesIndex]), 0, 0, 2048, 2048);

        if (hasGlasses) {
            if (glassesIndex === 4 || glassesIndex === 3) {
                const hasBoth = oneIn(2);
                if (hasBoth) {
                    ctx.drawImage(common.glasses[3], 0, 0, 2048, 2048);
                    ctx.drawImage(common.glasses[4], 0, 0, 2048, 2048);
                }
            }
            ctx.drawImage(common.glasses[glassesIndex], 0, 0, 2048, 2048);
        }

// Sauvegarder le rendu
        const inputPath = path.join(__dirname, `./outputs/${name}.png`);
        const outpath = path.join(__dirname, `./outputs/${name}.svg`);
        const out = fs.createWriteStream(inputPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', async () => {
            console.log('✅ Image masquée enregistrée')
            //await generateArt2svg(inputPath, outpath)
        });
    } catch (e) {
        console.error(e)
    }

}

const generateArt2svg = async (inputPath, outputPath) => {
    const size = 32;

    // Redimensionne à 32x32 et récupère les pixels
    const image = sharp(inputPath).resize(size, size, {fit: 'fill'}).ensureAlpha();
    const {data} = await image.raw().toBuffer({resolveWithObject: true});

    // Commence le SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">\n`;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            const [r, g, b, a] = data.slice(i, i + 4);

            if (a > 0) {
                const fill = `rgba(${r},${g},${b},${(a / 255).toFixed(2)})`;
                svg += `  <rect x="${x}" y="${y}" width="1" height="1" fill="${fill}" />\n`;
            }
        }
    }

    svg += `</svg>\n`;

    fs.writeFileSync(outputPath, svg);
    console.log(`✅ SVG saved to ${outputPath}`);
    //await askAI()
}

const data = {
    date: '2021-01-02',
    seed: 7700,
    values: [
        {id: 1, value: '#2979FF', intensity: 1.9, impact: 0.5},
        {id: 2, value: '#FF80AB', intensity: 1.7, impact: 0.8},
        {id: 3, value: '#FF6D00', intensity: 1.5, impact: 1},
        {id: 4, value: '#7C4DFF', intensity: 1.4, impact: 0.9},
        {id: 5, value: '#FFFF00', intensity: 1.2, impact: 0.7}
    ]
}

const askAI = async () => {
    const completion = await client.chat.completions.create({
        model: "grok-4",
        messages: [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content: "2 janvier 2021"
            },
        ],
    });
    console.log(JSON.parse(completion.choices[0].message.content));
}

export const prompt = "à partir dess thématiques les plus représentées par des postes sur X dans le monde génère le résultat suivant :\n" +
    "\n" +
    "Les thématiques sont les suivantes : \n" +
    "    \"SCIENCES\": {\n" +
    "        \"hex\": \"#3D5AFE\",\n" +
    "    },\n" +
    "    \"ENVIRONMENT\": {\n" +
    "        \"hex\": \"#00E676\",\n" +
    "    },\n" +
    "    \"EXPLORATION\": {\n" +
    "        \"hex\": \"#FFEA00\",\n" +
    "    },\n" +
    "    \"SPORT\": {\n" +
    "        \"hex\": \"#FF6D00\",\n" +
    "    },\n" +
    "    \"TECHNOLOGY\": {\n" +
    "        \"hex\": \"#7C4DFF\",\n" +
    "    },\n" +
    "    \"DEMOGRAPHICS\": {\n" +
    "        \"hex\": \"#D84315\",\n" +
    "    },\n" +
    "    \"ECONOMIC\": {\n" +
    "        \"hex\": \"#FFFF00\",\n" +
    "    },\n" +
    "    \"RELIGIOUS\": {\n" +
    "        \"hex\": \"#E040FB\",\n" +
    "    },\n" +
    "    \"MEDIA\": {\n" +
    "        \"hex\": \"#FF1744\",\n" +
    "    },\n" +
    "    \"LAWS\": {\n" +
    "        \"hex\": \"#BDBDBD\",\n" +
    "    },\n" +
    "    \"MILITARY\": {\n" +
    "        \"hex\": \"#00C853\",\n" +
    "    },\n" +
    "    \"KEY_POINT\": {\n" +
    "        \"hex\": \"#212121\",\n" +
    "    },\n" +
    "    \"GEOPOLITICS\": {\n" +
    "        \"hex\": \"#D50000\",\n" +
    "    },\n" +
    "    \"POLITICAL\": {\n" +
    "        \"hex\": \"#2979FF\",\n" +
    "    },\n" +
    "    \"SOCIAL\": {\n" +
    "        \"hex\": \"#FF80AB\",\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "\n" +
    "Je vais te donner une date, pour cette date donne moi le poids (<intensity>) de chaque catégorie entre 1 et 2 des postes les plus représentés dans le monde.\n" +
    "Ordonne les thématiques par valeur en DESC.\n" +
    "La date en <timestamp> devra etre fournie.\n" +
    "Chaque sujet vaut 1000 points, la valeur de <seed> vaut [sum(1000 * <intensity>, ..., 1000 * <intensity>)]\n" +
    "\n" +
    "Utilise le plus de sources possibles pour valider les poids. Si il y a des notes de communautés ou des diversion dans les avis indique cet <impact> entre 0 et 1,\n" +
    "Répond avec un objet JSON sous ce format (5 premier uniquement) :\n" +
    "\n" +
    "{\n" +
    "date:<timestamp>,\n" +
    "seed: <seed>,\n" +
    "values:\n" +
    "[\n" +
    "    {id: 1, value: <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "    {id: 2, value: <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "    {id: 3, value: <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "    {id: 4, value:  <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "    {id: 5, value:  <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "]\n" +
    "}\n" +
    "\n"

async function getLastModifiedFile(dirPath) {
    // Lire le contenu du dossier
    const files = await fs.promises.readdir(dirPath);

    if (files.length === 0) return null;

    // Récupérer les stats de chaque fichier
    const filesWithStats = await Promise.all(
        files.map(async file => {
            const filePath = path.join(dirPath, file);
            const stats = await fs.promises.stat(filePath);
            return {file, time: stats.mtime};
        })
    );

    // Trier par date de modification (plus récent en premier)
    filesWithStats.sort((a, b) => b.time - a.time);

    // Retourner le nom du dernier fichier modifié
    return filesWithStats[0].file;
}

async function getFirstPixelColor(filePath) {
    // Charger l'image et extraire en raw
    const data = await sharp(filePath)
        .raw()
        .toBuffer()

    // Les données sont [R, G, B, (A)] en Uint8
    const r = data[0];
    const g = data[1];
    const b = data[2];
    const a = 255; // Alpha par défaut à 255

    return {r, g, b, a};
}