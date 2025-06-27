// Importa los eventos predefinidos de Discord.js
import { Events } from 'discord.js';
// Importa la instancia del cliente desde el archivo principal
import { client } from '../index.js';
// Importa la función para crear configuración de servidores en la base de datos
import { createGuild } from '../GuildsConfig/configs.js';
// Importa la función para agregar todos los miembros del servidor a la base de datos
import { AddAllPlayers } from '../Commands/addAllPlayers.js';
// Importa la función para desplegar comandos slash
import { Deploy } from './ClientReady.js';
// Importa la función para configurar menús de opciones automáticos
import { OptionsMenu } from '../Automatic/OpcionesMenu.js';

// Función por defecto que registra el evento cuando el bot se une a un servidor
export default () => {
    // Evento que se ejecuta cuando el bot es invitado y se une a un nuevo servidor
    client.on(Events.GuildCreate, async (guild) => {
        // Mensaje de confirmación con el nombre y ID del servidor
        console.log(`🤖 El bot se unió al servidor: ${guild.name} (ID: ${guild.id})`);

        try {
            // Secuencia de configuración inicial del servidor:
            
            // 1. Crea la configuración del servidor en la base de datos
            await createGuild(guild.id);
            
            // 2. Agrega todos los miembros actuales del servidor a la base de datos
            await AddAllPlayers(guild);
            
            // 3. Configura los menús de opciones automáticos para el servidor
            await OptionsMenu(guild);
            
            // 4. Despliega/actualiza los comandos slash para este servidor
            await Deploy();
            
            // Mensaje de éxito cuando toda la configuración se completa
            console.log(`✅ Configuración inicial creada para el servidor: ${guild.id}`);
        } catch (error) {
            // Captura y muestra cualquier error durante la configuración inicial
            console.error(`❌ Error al crear la configuración para el servidor ${guild.id}:`, error);
        }
    });
};