import puppeteer from 'puppeteer';
import blockedKeys from './blocked_keywords.js';

export async function run(message) {
    const query = message.content.replace('%search ', '');
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    try {
        // Lanzar el navegador en modo headless
        const browser = await puppeteer.launch({
            headless: true, // Ejecutar sin interfaz gráfica
            executablePath: '/usr/bin/chromium-browser', // Ruta del ejecutable de Chromium
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Argumentos para evitar problemas de permisos
        });
        
        const page = await browser.newPage();
        await page.goto(url);

        // Obtener el primer resultado
        const firstResult = await page.evaluate(() => {
            const result = document.querySelector('h3');
            const link = result.closest('a');
            return { title: result.innerText, url: link.href };
        });

        await browser.close();

        // Censura de resultados
        const lowerCaseURL = firstResult.url.toLowerCase();
        const lowerCaseMessage = message.content.toLowerCase();
        const regex2 = /\+\p{L}/u;
        let censored = false;
        let censoredKey = false;

        // Revisar las palabras clave bloqueadas en el mensaje
        for (const keyword of blockedKeys) {
            if (lowerCaseMessage.includes(keyword)) {
                censoredKey = true;
                break;
            }
        }

        // Revisar las palabras clave bloqueadas en la URL
        for (const keyword of blockedKeys) {
            if (lowerCaseURL.includes(keyword)) {
                censored = true;
                break;
            }
        }

        // Verificar si el mensaje contiene caracteres prohibidos
        if (regex2.test(lowerCaseMessage)) {
            censoredKey = true;
        }

        // Responder según el filtro de censura
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
