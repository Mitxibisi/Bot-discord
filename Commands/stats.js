import { EmbedBuilder } from 'discord.js';
import randomColor from 'randomcolor';

export async function run(message) {
        try {
                // Obtener la información del servidor (guild)
                const guild = message.guild;

                // Asegurarse de que el bot tiene acceso al servidor
                if (!guild) {
                        return message.reply('Este comando solo puede usarse en un servidor.');
                }

                // Estadísticas básicas
                const totalMembers = guild.memberCount; // Número total de miembros
                const botCount = guild.members.cache.filter((member) => member.user.bot).size; // Número de bots
                const textChannels = guild.channels.cache.filter(
                        (channel) => channel.type === 0
                ).size; // Número de canales de texto
                const voiceChannels = guild.channels.cache.filter(
                        (channel) => channel.type === 2
                ).size; // Número de canales de voz
                const rolesCount = guild.roles.cache.size; // Número de roles
                const guildName = guild.name; // Nombre del servidor
                const guildIcon1 = guild.iconURL({ dynamic: true, size: 64 }); // URL del icono del servidor
                const guildIcon2 = guild.iconURL({ dynamic: true, size: 1024 }); // URL del icono del servidor
                const guildCreationDate = guild.createdAt.toLocaleDateString(); // Fecha de creación del servidor

                // Obtener el dueño del servidor
                const owner = await guild.members.fetch(guild.ownerId);
                const ownerName = owner.user.tag; // Nombre del dueño
                const ownerAvatar = owner.user.displayAvatarURL({ dynamic: true, size: 64 }); // Avatar del dueño
                
                // Color del embed
                const color = randomColor();

                // Enviar el mensaje al canal
                const embed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: guildName, iconURL: guildIcon1 }) // Muestra el nombre con el icono
                .setThumbnail(guildIcon2) // También puedes ponerlo como miniatura
                .addFields(
                        {name: 'Total de miembros:', value: `**${totalMembers}**`},
                        {name: 'Bots:', value: `**${botCount}**`},
                        {name: 'Canales de texto:', value: `**${textChannels}**`},
                        {name: 'Canales de voz:', value: `**${voiceChannels}**`},
                        {name: 'Total de roles:', value: `**${rolesCount}**`},
                        {name: 'Dueño del servidor:', value: `**${ownerName}**`}
                )
                .setFooter({ text: `ID: ${guild.id} || Created date: ${guildCreationDate}` })
                .setImage(ownerAvatar); // Avatar del dueño como imagen

                message.channel.send({ embeds: [embed] });
        } catch (error) {
                console.error('Error ejecutando el comando %stats:', error);
                message.reply('Hubo un error al obtener las estadísticas del servidor.');
        }
}