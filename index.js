// Importa la clase Client y los permisos de Discord.js para crear el bot
import { Client, GatewayIntentBits } from 'discord.js';
// Importa funciones para leer archivos de forma asíncrona
import { readFile } from 'fs/promises';
import { readdir } from 'fs/promises'; // Para leer los archivos de eventos de la carpeta Events

// Lee y parsea el archivo de configuración que contiene el token del bot
// export permite que otros archivos importen esta configuración
export let config = JSON.parse(await readFile(new URL('./config.json', import.meta.url)));

// Crea una nueva instancia del cliente de Discord con los permisos necesarios
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,          // Permite acceso a información de servidores
        GatewayIntentBits.GuildMessages,   // Permite leer mensajes en servidores
        GatewayIntentBits.MessageContent,  // Permite leer el contenido de los mensajes
        GatewayIntentBits.GuildMembers,    // Permite acceso a información de miembros
        GatewayIntentBits.GuildVoiceStates // Permite detectar cambios en canales de voz
    ]
});

// Inicializa el conjunto global para canales temporales
// Esto permite rastrear canales de voz temporales creados por el bot
if (!global.temporaryChannels) {
    global.temporaryChannels = new Set();
}

// Función principal que inicializa el bot
async function main() {
    try {
        // Registrar eventos automáticamente desde la carpeta 'Events'
        // Lee todos los archivos .js de la carpeta Events y los importa dinámicamente
        const eventFiles = await readdir('./Events');
        for (const file of eventFiles) {
            if (file.endsWith('.js')) {
                // Importa cada archivo de evento usando import dinámico
                const { default: event } = await import(`./Events/${file}`);
                event(); // Ejecuta la función del evento para registrarlo
                console.log(`Evento ${file} registrado.`);
            }
        }

        // Verifica que el token esté presente en la configuración
        if (!config.token) {
            console.error('Token no encontrado en config.json.');
            process.exit(1); // Termina el programa si no hay token
        }

        // Inicia sesión en Discord usando el token del bot
        client.login(config.token);
    } catch (error) {
        // Captura y muestra cualquier error que ocurra durante la inicialización
        console.error('Error al iniciar el bot:', error);
    }
}

// Maneja promesas rechazadas que no fueron capturadas
// Esto evita que el programa se cierre inesperadamente
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Maneja excepciones no capturadas
// Si ocurre un error crítico, termina el programa de forma controlada
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
});

// Llamar a la función principal para iniciar el bot
main();
