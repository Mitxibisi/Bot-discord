// Importa los eventos predefinidos de Discord.js
import { Events } from 'discord.js';
// Importa la instancia del cliente desde el archivo principal
import { client } from '../index.js';
// Importa la función para configurar la lista de comandos automáticamente
import { setupDeploymentList } from '../Automatic/deploymentList.js';

// Función por defecto que registra los eventos cuando el bot está listo
export default () => {
    // Evento que se ejecuta cuando el bot se conecta completamente a Discord
    client.on(Events.ClientReady, async () => {
        console.log(`Conectado como ${client.user.tag}!`); // Muestra el nombre del bot
        Deploy(); // Ejecuta la función de despliegue de comandos
    });

    // Evento que se ejecuta UNA SOLA VEZ cuando el bot está listo
    // 'once' significa que solo se ejecutará la primera vez
    client.once('ready', () => {
        // Muestra cuántos servidores (guilds) tiene el bot
        console.log(`Conectado a ${client.guilds.cache.size} servidor(es).`);
    });

};

// Función asíncrona que maneja el despliegue de comandos slash
export async function Deploy() {
    // Ejecuta la configuración automática de la lista de comandos
    // Esto registra todos los comandos slash del bot en Discord
    await setupDeploymentList();
};