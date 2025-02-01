import { Client, GatewayIntentBits } from 'discord.js';
import { readFile, writeFile } from 'fs/promises';
import { readdir } from 'fs/promises'; // Para leer los archivos de eventos

export let config = JSON.parse(await readFile(new URL('./config.json', import.meta.url)));

export async function updateConfig(newValues) {
    try {
        const configPath = new URL('./config.json', import.meta.url);
        
        // Crear una nueva copia de config
        const updatedConfig = { ...config, ...newValues };

        // Escribir la nueva configuración en el archivo
        await writeFile(configPath, JSON.stringify(updatedConfig, null, 2));

        config = updatedConfig;

        console.log('Config.json actualizado correctamente.');
    } catch (error) {
        console.error('Error al actualizar config.json:', error);
        throw error;
    }
}

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
                process.exit(1); // Opcional: salir del proceso
                });


main(); // Llamar a la función principal
