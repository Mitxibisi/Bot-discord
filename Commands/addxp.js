import { addXp} from '../Usersdb/database.js';

export async function run (message, Guild){
    const guildId = message.guild.id;
    // Obtener el GuildMember del autor del mensaje
    const guildMember = await message.guild.members.fetch(message.author.id);
    // Dividir el mensaje en argumentos
    const args = message.content.split(' ');
    const xpAmount = parseInt(args[1], 10); // Toma el segundo argumento como XP
    const targetUserMention = args[2]; // Mención del usuario objetivo

    // Validar el argumento de XP
    if (isNaN(xpAmount)) {
        return message.reply('Por favor, proporciona una cantidad válida de XP.');
    }

    // Obtener usuario objetivo
    let targetMember;
    if (targetUserMention) {
        // Validar que se ha mencionado a un usuario
        const match = targetUserMention.match(/^<@!?(\d+)>$/);
        if (!match) {
            return message.reply('Por favor, menciona un usuario válido para asignar XP.');
        }

        const targetUserId = match[1];
        targetMember = await message.guild.members.fetch(targetUserId).catch(() => null);

        if (!targetMember) {
            return message.reply('No se ha encontrado al usuario mencionado en este servidor.');
        }
    } else {
        // Si no se menciona, se asigna XP al autor
        targetMember = guildMember;
    }

    // Añadir XP
    await addXp(guildId, targetMember.id, xpAmount, targetMember, message, null, Guild);
    return message.reply(`Se han añadido ${xpAmount} XP a ${targetMember.user.displayName}.`);
}