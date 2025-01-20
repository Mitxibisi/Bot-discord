import { reset } from '../usersdb/database.js';

export async function run(message){
// Obtener el GuildMember del autor del mensaje
const guildMember = await message.guild.members.fetch(message.author.id);
        
// ID del rol requerido
const requiredRoleId = '731870690206154785'; // Reemplaza con el ID del rol necesario

// Comprobar si el autor tiene el rol requerido
if (guildMember.roles.cache.has(requiredRoleId)) {
    // Dividir el mensaje en argumentos
    const args = message.content.split(' ');
    const targetUserMention = args[1]; // Mención del usuario objetivo

    // Obtener usuario objetivo
    let targetMember;
    if (targetUserMention) {
        // Validar que se ha mencionado a un usuario
        const match = targetUserMention.match(/^<@!?(\d+)>$/);
        if (!match) {
            return message.reply('Por favor, menciona un usuario válido para resetear.');
        }

        const targetUserId = match[1];
        targetMember = await message.guild.members.fetch(targetUserId).catch(() => null);

        if (!targetMember) {
            return message.reply('No se ha encontrado al usuario mencionado en este servidor.');
        }
    } else {
        // Si no se menciona, se resetea al autor en la base de datos
        targetMember = guildMember;
    }

    // Resetear miembro
    await reset(targetMember.id);
    return message.reply(`Se ha resetado los datos del usuario: ${targetMember.user.displayName}.`);
} else {
    // El usuario no tiene el rol requerido
    return message.reply('No tienes los permisos necesarios para ejecutar este comando.');
}
}