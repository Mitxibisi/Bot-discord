// Importa los eventos predefinidos de Discord.js
import { Events } from 'discord.js';
// Importa la instancia del cliente desde el archivo principal
import { client } from '../index.js';
// Importa la función para crear un nuevo usuario en la base de datos
import { createUser} from '../Usersdb/database.js';
// Importa la función para obtener la configuración de un servidor
import { getGuild } from '../GuildsConfig/configs.js';

// Función por defecto que registra el evento cuando un nuevo miembro se une al servidor
export default () => {
    // Evento que se ejecuta cuando una nueva persona se une al servidor
    client.on(Events.GuildMemberAdd, async (member) => {
    try{  
        // Obtiene la configuración específica del servidor donde se unió el miembro
        const Guild = await getGuild(member.guild.id);
        
        // Obtiene el ID del canal configurado para mensajes de bienvenida
        const welcomeChannelId = Guild.GuildMemberAddRemoveId;
        
        // Busca el rol configurado para nuevos miembros en el servidor
        const role = member.guild.roles.cache.get(Guild.NewmemberRoleId);
        
        // Verifica que el nuevo miembro NO sea un bot
        if(!member.user.bot){
            // Crea el perfil del usuario en la base de datos con su información básica
            await createUser(member.guild.id,member.id,member.user.username);       
            
            // Si existe un rol para nuevos miembros, se lo asigna automáticamente
            if(role){
                await member.roles.add(role);
            }
        }
        
        // Si hay un canal de bienvenida configurado, envía el mensaje de bienvenida
        if (welcomeChannelId){
            // Obtiene el canal usando su ID
            const channel = await client.channels.fetch(welcomeChannelId);
            if (channel) {
                // Importa dinámicamente la plantilla de mensaje de bienvenida
                const commandPath = '../Templates/bienvenida.js';
                const commandModule = await import(commandPath);
                console.log(`Módulo cargado desde: ${commandPath}`);
                
                // Si la plantilla tiene una función 'run', la ejecuta con el miembro y canal
                if (typeof commandModule.run === 'function') {
                    await commandModule.run(member, channel);
                }
            }
        }
    }catch (error) {
            // Captura y muestra cualquier error durante el proceso de bienvenida
            console.error(`Error en GuildMemberAdd: ${error.message}`);
        }
    });
};