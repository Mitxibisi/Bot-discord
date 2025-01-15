import { EmbedBuilder } from 'discord.js';
import randomColor from 'randomcolor';

async function sendUserRoles(message) {
    // Asegúrate de que el mensaje proviene de un servidor
    if (!message.guild) {
        return message.reply('Este comandó ndo solo se puede usar en servidores.');
    }

    // Obtén el usuario mencionado o el author del mensaje si no se menciona a nadie
    const member = message.mentions.members.first() || message.member;

    // Si no se puede obtener el miembro, envía un mensaje de error
    if (!member) {
        return message.reply('No se pudo encontrar al usuario.');
    }

    // Obtén los roles del miembro, excluyendo el @everyone (rol predeterminado)
    const roles = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.name)
        .join(', ');

    // Si el usuario no tiene roles específicos, indícalo
    const rolesMessage = roles.length > 0 ? roles : 'Este usuario no tiene roles asignados.';

    // Envía un mensaje con los roles del usuario
    return (rolesMessage);
}

export async function perfilembed(message, user) {
    const color = randomColor();
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`**${message.member.displayName} - Nivel ${user.level.toString()}**`)
        .setDescription(`Exp: ${user.xp.toString()} / ${user.levelupxp.toString()}`)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 512}))
        .addFields(
            { name: `Roles asignados:`, value: await sendUserRoles(message) },

            { name: 'Miembro desde: ', value: message.member.joinedAt.toString()}
        )
    message.channel.send({ embeds: [embed] });
}