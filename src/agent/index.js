import puppeteer from "puppeteer";
import path from "path";
import {fileURLToPath} from 'url';
import {writeFileSync} from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
    });
    // { headless: false } si tu veux voir le navigateur
    const page = await browser.newPage();
    await page.goto('https://moshpro.app/lite/');

    const title = await page.title();
    console.log('Titre de la page:', title);

    const filePath = path.resolve(path.join(__dirname, '../../public/uploads/1.jpg'));

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
    writeFileSync(path.join(__dirname, '../../public/uploads/ez.png'), base64Data, 'base64');
    await generateArt()
    await browser.close();
})();

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

const generateArt = async () => {


    const image = await loadImage(path.join(__dirname, '../../public/uploads/ez.png'));
    const mask = await loadImage(path.join(__dirname, '../../public/mask.png')); // peut être PNG aussi

    // Créer le canvas avec les dimensions de base
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

// Dessiner la première image
    ctx.drawImage(image, 0, 0);

// Dessiner par-dessus ton image personnalisée (même taille ou repositionnée)
    ctx.drawImage(mask,  192,  192, 1664, 1856);

// Sauvegarder le rendu
    const out = fs.createWriteStream(path.join(__dirname, '../../public/outputs/final.png'));
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('✅ Image masquée enregistrée'));
}