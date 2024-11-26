import puppeteer from 'puppeteer';
import blockedKeys from './blocked_keywords.js';

export async function run(message) {
    const query = message.content.replace('.search ', '');
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        // Obtiene el primer resultado
        const firstResult = await page.evaluate(() => {
            const result = document.querySelector('h3');
            const link = result.closest('a');
            return { title: result.innerText, url: link.href };
        });

        await browser.close();

        const lowerCaseURL = firstResult.url.toLowerCase();
        const lowerCaseMessage = message.content.toLowerCase();
        const regex2 = /\+\p{L}/u;

        let censored = false;
        let censoredKey = false;

        for (const keyword of blockedKeys) {
            if (lowerCaseMessage.includes(keyword)) {
                censoredKey = true;
                break;
            }
        }

        for (const keyword of blockedKeys) {
            if (lowerCaseURL.includes(keyword)) {
                censored = true;
                break;
            }
        }

        if (regex2.test(lowerCaseMessage)) {
            censoredKey = true;
        }

        if (censored || censoredKey) {
            message.reply('Filtro de censura activado.');
        } else {
            if (firstResult) {
                message.reply(`**${firstResult.title}**\n${firstResult.url}`);
            } else {
                message.reply('No se encontraron resultados para tu búsqueda.');
            }
        }
    } catch (error) {
        console.error('Error al buscar en Google con Puppeteer:', error);
        message.reply('Hubo un error al realizar la búsqueda.');
    }
}