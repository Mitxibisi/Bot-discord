// Importa los eventos predefinidos de Discord.js
import { Events } from 'discord.js';
// Importa la instancia del cliente desde el archivo principal
import { client } from '../index.js';
// Importa la función para eliminar configuración de servidores de la base de datos
import { guildDelete } from '../GuildsConfig/configs.js'
// Importa la función para eliminar todos los usuarios del servidor de la base de datos
import { usersDelete } from '../Usersdb/database.js';
// Importa la función para eliminar todos los tickets del servidor de la base de datos
import { ticketsDelete } from '../Tickets/tickets.js';

// Función por defecto que registra el evento cuando el bot es removido de un servidor
export default () => {
    // Evento que se ejecuta cuando el bot es expulsado, kickeado o el servidor es eliminado
    client.on(Events.GuildDelete, async (guild) => {
        // Mensaje informativo cuando el bot deja un servidor
        console.log(`🤖 El bot fue expulsado del servidor: ${guild.name} (ID: ${guild.id})`);

        try {
            // Secuencia de limpieza de datos del servidor:
            
            // 1. Elimina la configuración del servidor de la base de datos
            await guildDelete(guild.id);
            
            // 2. Elimina todos los datos de usuarios/miembros de ese servidor
            await usersDelete(guild.id);
            
            // 3. Elimina todos los tickets creados en ese servidor
            await ticketsDelete(guild.id);
            
            // Mensaje de confirmación cuando todos los datos se eliminan correctamente
            console.log(`✅ Datos del servidor: ${guild.id} eliminados`);
        } catch (error) {
            // Captura y muestra cualquier error durante el proceso de limpieza
            console.error(`❌ Error al borrar los datos del servidor ${guild.id}:`, error);
        }
    });
};