import { Client, GatewayIntentBits } from 'discord.js';
import { readFile } from 'fs/promises';
import { readdir } from 'fs/promises'; // Para leer los archivos de eventos


// Actualmente este archivo solamente sera para el token
export let config = JSON.parse(await readFile(new URL('./config.json', import.meta.url)));

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Inicializa el conjunto global para canales temporales
if (!global.temporaryChannels) {
    global.temporaryChannels = new Set();
}

async function main() {
    try {
        // Registrar eventos automáticamente desde la carpeta 'events'
        const eventFiles = await readdir('./Events');
        for (const file of eventFiles) {
            if (file.endsWith('.js')) {
                const { default: event } = await import(`./Events/${file}`);
                event(); // Llama a cada archivo de evento
                console.log(`Evento ${file} registrado.`);
            }
        }

        if (!config.token) {
            console.error('Token no encontrado en config.json.');
            process.exit(1);
        }


        client.login(config.token);
    } catch (error) {
        console.error('Error al iniciar el bot:', error);
    }
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
});

main(); // Llamar a la función principal
