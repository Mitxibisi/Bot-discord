// Importa los eventos predefinidos de Discord.js
import { Events } from 'discord.js';
// Importa la instancia del cliente desde el archivo principal
import { client } from '../index.js';
// Importa la función para obtener la configuración de un servidor
import { getGuild } from '../GuildsConfig/configs.js';
// Importa la función para eliminar un usuario específico de la base de datos
import { userDelete } from '../Usersdb/database.js';

// Función por defecto que registra el evento cuando un miembro abandona el servidor
export default () => {
    // Evento que se ejecuta cuando alguien abandona, es expulsado o baneado del servidor
    client.on(Events.GuildMemberRemove, async (member) => {
        try{
            // Verifica que el miembro que se fue NO sea el propio bot
            // Esto evita procesar cuando el bot es removido del servidor
            if(member.user.id !== client.user.id){

            // Obtiene la configuración específica del servidor
            const Guild = await getGuild(member.guild.id);
            
            // Obtiene el ID del canal configurado para mensajes de despedida
            const welcomeChannelId = Guild.GuildMemberAddRemoveId;
            
            // Si el miembro que se fue NO es un bot, elimina sus datos
            if (!member.user.bot){
                // Elimina el perfil del usuario de la base de datos
                await userDelete(member.user.id, member.guild.id);
            }

            // Verifica si hay un canal configurado para mensajes de despedida
            if (!welcomeChannelId){
                // Si no hay canal configurado, no hace nada
                console.log('Prueba');
                return;
            }else{
                // Si hay canal configurado, procede a enviar mensaje de despedida
                const channel = await client.channels.fetch(welcomeChannelId);
                if (channel) {
                    // Importa dinámicamente la plantilla de mensaje de despedida
                    const commandPath = '../Templates/despedida.js';
                    const commandModule = await import(commandPath);
                    console.log(`Módulo cargado desde: ${commandPath}`);
                    
                    // Si la plantilla tiene una función 'run', la ejecuta con el miembro y canal
                    if (typeof commandModule.run === 'function') {
                        await commandModule.run(member, channel);
                    }
                }
            }
        }
        }catch (error) {
                    // Captura y muestra cualquier error durante el proceso de despedida
                    console.error(`Error en GuildMemberRemove: ${error.message}`);
        }
    });
};