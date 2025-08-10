import puppeteer from "puppeteer";
import path from "path";
import {fileURLToPath} from 'url';
import {createCanvas, loadImage} from 'canvas';
import fs from 'fs';
import sharp from "sharp";
import {randomInt} from "crypto";
import OpenAI from "openai";

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
        await page.goto(`http://localhost:5175/${query}`, { waitUntil: 'networkidle0' })
        await wait(3000)
        await generateAsset(i)
    }
    await browser.close();
})();


const generateArt = async (name) => {

    const eyesIndex = randomInt(0, 10);
    const headIndex = randomInt(0, 8);
    const glassesIndex = randomInt(0, 9);
    const maskIndex = randomInt(0, 9);

    const isNaked = oneIn(100);
    const isNeck = oneIn(10);
    const hasHeart = oneIn(50);
    const hasAura = oneIn(1000);
    const hasMaskType = oneIn(1);
    const hasGlasses = oneIn(2);

    const image = await loadImage(path.join(__dirname, `./uploads/${name}.png`));
    const mask = await loadImage(path.join(__dirname, './res/common/mask.svg'));
    const heart = await loadImage(path.join(__dirname, './res/common/heart.svg'));
    // heroes
    const neck = await loadImage(path.join(__dirname, './res/heroes/body/neck.svg'));
    const naked = await loadImage(path.join(__dirname, './res/heroes/body/naked.svg'));
    // mask def
    const mask_1 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_1.svg'));
    const mask_2 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_2.svg'));
    const mask_3 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_3.svg'));
    const mask_4 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_4.svg'));
    //const mask_5 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_5.svg'));
    //const mask_6 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_6.svg'));
    const mask_7 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_7.svg'));
    const mask_8 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_8.svg'));
    const mask_9 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_9.svg'));
    const mask_10 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_10.svg'));
    const mask_11 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_11.svg'));
    const mask_12 = await loadImage(path.join(__dirname, './res/heroes/mask/mask_12.svg'));

    const heroAura = await loadImage(path.join(__dirname, './res/heroes/aura/aura.svg'));
    // eyes
    const eyes_1 = await loadImage(path.join(__dirname, './res/common/eyes_1.svg'));
    const eyes_2 = await loadImage(path.join(__dirname, './res/common/eyes_2.svg'));
    const eyes_3 = await loadImage(path.join(__dirname, './res/common/eyes_3.svg'));
    const eyes_4 = await loadImage(path.join(__dirname, './res/common/eyes_4.svg'));
    const eyes_5 = await loadImage(path.join(__dirname, './res/common/eyes_5.svg'));
    const eyes_6 = await loadImage(path.join(__dirname, './res/common/eyes_6.svg'));
    const eyes_7 = await loadImage(path.join(__dirname, './res/common/eyes_7.svg'));
    const eyes_8 = await loadImage(path.join(__dirname, './res/common/eyes_8.svg'));
    const eyes_9 = await loadImage(path.join(__dirname, './res/common/eyes_9.svg'));
    const eyes_10 = await loadImage(path.join(__dirname, './res/common/eyes_10.svg'));
    const eyes_11 = await loadImage(path.join(__dirname, './res/common/eyes_11.svg'));
    // glasses
    const glasses_1 = await loadImage(path.join(__dirname, './res/common/glasses_1.svg'));
    const glasses_2 = await loadImage(path.join(__dirname, './res/common/glasses_2.svg'));
    const glasses_3 = await loadImage(path.join(__dirname, './res/common/glasses_3.svg'));
    const glasses_4 = await loadImage(path.join(__dirname, './res/common/glasses_4.svg'));
    const glasses_5 = await loadImage(path.join(__dirname, './res/common/glasses_5.svg'));
    const glasses_6 = await loadImage(path.join(__dirname, './res/common/glasses_6.svg'));
    const glasses_7 = await loadImage(path.join(__dirname, './res/common/glasses_7.svg'));
    const glasses_8 = await loadImage(path.join(__dirname, './res/common/glasses_8.svg'));
    const glasses_9 = await loadImage(path.join(__dirname, './res/common/glasses_9.svg'));
    const glasses_10 = await loadImage(path.join(__dirname, './res/common/glasses_10.svg'));

    // heads
    const head_1= await loadImage(path.join(__dirname, './res/heroes/head/head_1.svg'));
    const head_2= await loadImage(path.join(__dirname, './res/heroes/head/head_2.svg'));
    const head_3= await loadImage(path.join(__dirname, './res/heroes/head/head_3.svg'));
    const head_4= await loadImage(path.join(__dirname, './res/heroes/head/head_4.svg'));
    const head_5= await loadImage(path.join(__dirname, './res/heroes/head/head_5.svg'));
    const head_6= await loadImage(path.join(__dirname, './res/heroes/head/head_6.svg'));
    const head_7= await loadImage(path.join(__dirname, './res/heroes/head/head_7.svg'));
    const head_8= await loadImage(path.join(__dirname, './res/heroes/head/head_8.svg'));
    const head_9= await loadImage(path.join(__dirname, './res/heroes/head/head_9.svg'));


    const common = {
        mask,
        heart,
        glasses: [
            glasses_1,
            glasses_2,
            glasses_3,
            glasses_4,
            glasses_5,
            glasses_6,
            glasses_7,
            glasses_8,
            glasses_9,
            glasses_10
        ],
        eyes: [
            eyes_1,
            eyes_2,
            eyes_3,
            eyes_4,
            eyes_5,
            eyes_6,
            eyes_7,
            eyes_8,
            eyes_9,
            eyes_10,
            eyes_11,
        ]
    }
    const hero = {
        heroAura,
        naked,
        neck,
        heads: [
            head_1,
            head_2,
            head_3,
            head_4,
            head_5,
            head_6,
            head_7,
            head_8,
            head_9,
        ],
        masks: [
            mask_1,
            mask_2,
            mask_3,
            mask_4,
            //mask_5,
            //mask_6,
            mask_7,
            mask_8,
            mask_9,
            mask_10,
            mask_11,
            mask_12,
        ],
    }
    // Créer le canvas avec les dimensions de base
    const canvas = createCanvas(2048, 2048);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);
    ctx.drawImage(common.mask, 192, 192, 1664, 1856);
    ctx.drawImage(common.eyes[eyesIndex], 0, 0, 2048, 2048);
    ctx.drawImage(hero.heads[headIndex], 0, 0, 2048, 2048);

    hasAura && ctx.drawImage(hero.heroAura, 0, 0, 2048, 2048);

    isNaked && ctx.drawImage(hero.naked, 0, 0, 2048, 2048);
    isNeck && ctx.drawImage(hero.neck, 0, 0, 2048, 2048);
    hasHeart && ctx.drawImage(common.heart, 0, 0, 2048, 2048);
    hasMaskType && ctx.drawImage(hero.masks[maskIndex], 0, 0, 2048, 2048);



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
            return { file, time: stats.mtime };
        })
    );

    // Trier par date de modification (plus récent en premier)
    filesWithStats.sort((a, b) => b.time - a.time);

    // Retourner le nom du dernier fichier modifié
    return filesWithStats[0].file;
}