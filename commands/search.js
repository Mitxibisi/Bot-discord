const puppeteer = require('puppeteer');
const blockedKeys = require('./blocked_keywords');

    module.exports = {
        description: 'Busca en Google usando Puppeteer y devuelve la primera URL',
        run: async (message) => {
            if (!message.content.startsWith('.search ')) return;

            const query = message.content.replace('.search', '');
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

                const lowerCaseURL = firstResult.url.toLowerCase();  // Asegúrate de acceder a `url`, no `content`
                const lowerCasemessage = message.content.toLowerCase();
                const regex2 = /\+\p{L}/u;

                // Asumiendo que `blockedKeys` es una lista de palabras clave prohibidas
                let censored = false;  // Bandera para saber si se debe censurar
                let censoredKey = false;

                for (const keyword of blockedKeys) {
                    if (lowerCasemessage.includes(keyword)) {
                        censoredKey = true;
                        break;  // Salimos del bucle si encontramos una coincidencia
                    }
                }

                for (const keyword of blockedKeys) {
                    if (lowerCaseURL.includes(keyword)) {
                        censored = true;
                        break;  // Salimos del bucle si encontramos una coincidencia
                    }
                }

                if (regex2.test(lowerCasemessage)) {
                    censoredKey = true;
                }

                if (censored||censoredKey) {
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
    }
