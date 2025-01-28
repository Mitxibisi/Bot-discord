import { Deploy } from "../Events/ClientReady.js";

export async function run(message,client,config) {
    const guildMember = await message.guild.members.fetch(message.author.id);
    try{
        // ID del rol requerido
        const requiredRoleId = config.adminRoleId;
    
        // Comprobar si el autor tiene el rol requerido
        if (guildMember.roles.cache.has(requiredRoleId)) {
            Deploy(config);
            message.reply('Ranking del server actualizado')
        } else {
            // El usuario no tiene el rol requerido
            return message.reply('No tienes los permisos necesarios para ejecutar este comando.');
        }
    }
    catch(error){
        console.log(`Error al actualizar ranking: ${error}`);
    }
}