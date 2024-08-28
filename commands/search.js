const puppeteer = require('puppeteer');
const blockedDomains = require('./blocked_keywords');

    module.exports = {
        description: 'Busca en Google usando Puppeteer y devuelve la primera URL',
        run: async (message) => {
            if (!message.content.startsWith('.search ')) return;
            const lowerCaseMessage = message.content.toLowerCase();

            // Verificar si el mensaje contiene algún dominio prohibido
            for (const domain of blockedDomains) {
                if (lowerCaseMessage.includes(domain)) {
                    message.reply(`La búsqueda incluye un dominio prohibido (${domain}).`);
                    return;
                }
            }

            // Censura de palabras específicas
            const censoredWords = ["polla", "coño", "tetas", "genitales", "porno", "sexo", "masturbacion", "semen", "paja", "mamada", "penetracion", "xxx"];
            if (censoredWords.some(word => lowerCaseMessage.includes(word))) {
                message.reply('Filtro de censura activado.');
                return;
            }

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

                if (firstResult) {
                    message.reply(`**${firstResult.title}**\n${firstResult.url}`);
                } else {
                    message.reply('No se encontraron resultados para tu búsqueda.');
                }
            } catch (error) {
                console.error('Error al buscar en Google con Puppeteer:', error);
                message.reply('Hubo un error al realizar la búsqueda.');
            }
        }
    }
