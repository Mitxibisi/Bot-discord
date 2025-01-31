import { reset } from '../Usersdb/database.js'

export async function run(message) {
    const guildId = message.guild.id;
    // Obtener el GuildMember del autor del mensaje
    const guildMember = await message.guild.members.fetch(message.author.id).catch(() => null);

    // Dividir el mensaje en argumentos
    const args = message.content.split(' ');
    const targetUserMention = args[1]; // Mención del usuario objetivo

    // Determinar al usuario objetivo
    let targetMember = guildMember; // Por defecto, el usuario objetivo es el autor del mensaje

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
    }

    try {
        // Ejecutar el reseteo
        await reset(guildId,targetMember.id);
        return message.reply(
            `✅ Se han reseteado los datos del usuario: **${targetMember.user.username}**.`
        );
    } catch (error) {
        console.error('Error al resetear datos del usuario:', error.message);
        return message.reply(
            `❌ Ocurrió un error al intentar resetear los datos de **${targetMember.user.username}**.`
        )
    }
}