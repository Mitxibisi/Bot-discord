import { EmbedBuilder } from 'discord.js';
import randomColor from 'randomcolor';

async function sendUserRoles(message) {
    // Asegúrate de que el mensaje proviene de un servidor
    if (!message.guild) {
        return 'Este comando solo se puede usar en servidores.';
    }

    // Obtén el usuario mencionado o el autor del mensaje si no se menciona a nadie
    const member = message.mentions.members.first() || message.member;

    // Si no se puede obtener el miembro, devuelve un mensaje de error
    if (!member) {
        return 'No se pudo encontrar al usuario.';
    }

    // Obtén los roles del miembro, excluyendo el @everyone (rol predeterminado)
    const roles = member.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => role.name)
        .join('\n'); // Cambiado a salto de línea

    // Si el usuario no tiene roles específicos, indícalo
    return roles.length > 0 ? roles : 'Este usuario no tiene roles asignados.';
}

export async function perfilembed(message, user) {
    const color = randomColor();
    const mentionedMember = message.mentions.members.first();
    const member = mentionedMember || message.member;

    const joinedDate = member.joinedAt
    ? member.joinedAt.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      })
    : 'Fecha no disponible';

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`**${member.displayName} - Nivel ${user.level.toString()}**`)
        .setDescription(`Exp: ${user.xp.toString()} / ${user.levelupxp.toString()}`)
        .setThumbnail(member.displayAvatarURL({dynamic: true, size: 512}))
        .addFields(
            { name: `Roles asignados:`, value: await sendUserRoles(message) },

            { name: 'Miembro desde: ', value: joinedDate}
        )
    message.channel.send({ embeds: [embed] });
}