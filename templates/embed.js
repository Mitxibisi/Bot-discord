import { EmbedBuilder } from 'discord.js';

async function sendUserRoles(message) {
    // Asegúrate de que el mensaje proviene de un servidor
    if (!message.guild) {
        return message.reply('Este comandó ndo solo se puede usar en servidores.');
    }

    // Obtén el usuario mencionado o el autor del mensaje si no se menciona a nadie
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
    return (`${member.user.tag} tiene los siguientes roles: ${rolesMessage}`);
}

export async function run(message, user) {
    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(message.author.username)
        .setDescription(await sendUserRoles(message))
        .setThumbnail('https://t3.ftcdn.net/jpg/03/18/01/96/360_F_318019685_EV3M47BKGuK3iFG5cOQmVjPy15bc7CkC.jpg')
        .addFields(
            { name: 'Nivel', value: user.level },
            { name: 'ExperienciaMax', value: user.levelupxp },
            { name: 'ExperienciaActual', value: user.xp, inline: true },
            { name: 'RolId', value: user.rolid, inline: true }
        )
        .setFooter({ text: 'Este es un pie de página', iconURL: 'https://t3.ftcdn.net/jpg/03/18/01/96/360_F_318019685_EV3M47BKGuK3iFG5cOQmVjPy15bc7CkC.jpg' });

    message.channel.send({ embeds: [embed] });
}