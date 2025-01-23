import { EmbedBuilder } from 'discord.js';
import randomColor from 'randomcolor';

async function sendUserRoles(message) {
    // Asegúrate de que el mensaje proviene de un servidor
    if (!message.guild) {
        return 'Este comando solo se puede usar en servidores.';
    }

    // Obtén el usuario mencionado o el autor del mensaje si no se menciona a nadie
    const member = message.mentions.members.first() || message.member;

    // Si no se puede obtener el miembro, envía un mensaje de error
    if (!member) {
        return 'No se pudo encontrar al usuario.';
    }

    // Lista de roles a excluir
    const excludedRoles = ['@everyone', 'Normis'];

    // Filtra y ordena los roles
    const roles = member.roles.cache
        .filter(role => !excludedRoles.includes(role.name)) // Excluye los roles especificados
        .sort((a, b) => b.position - a.position) // Ordena por jerarquía (posición en el servidor)
        .map(role => role.name); // Obtén los nombres de los roles

    // Si el usuario no tiene roles específicos, indícalo
    const rolesMessage = roles.length > 0 ? roles.join('\n') : 'Este usuario no tiene roles visibles.';
    return rolesMessage;
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
    if (user) {

        const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`🌟 **${member.displayName} - Nivel ${user.level.toString()}** 🌟`)
        .setDescription(`📈 **Exp:** ${user.xp.toString()} / ${user.levelupxp.toString()}
            `)
        .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 512 }))
        .addFields(
            { name: '🛡️ **Roles asignados:**', value: await sendUserRoles(message) },

            { name: '📅 **Miembro desde:**', value: joinedDate }
        )
        .setFooter({
            text: 'GoodLife Profile 💬',
        });

    message.channel.send({ embeds: [embed] });
} else {
    message.channel.send('❌ Usuario erróneo. Asegúrate de mencionar a un usuario válido.');
}
} 