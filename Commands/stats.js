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
                const onlineMembers = guild.members.cache.filter(
                        (member) => member.presence?.status === 'online' //Sale 0
                ).size; // Miembros en línea
                const botCount = guild.members.cache.filter((member) => member.user.bot).size; // Número de bots
                const textChannels = guild.channels.cache.filter(
                        (channel) => channel.type === 0
                ).size; // Número de canales de texto
                const voiceChannels = guild.channels.cache.filter(
                        (channel) => channel.type === 2
                ).size; // Número de canales de voz
                const rolesCount = guild.roles.cache.size; // Número de roles
                
                // Color del embed
                const color = randomColor();

                // Enviar el mensaje al canal
                const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle('📊 **Estadísticas del Servidor:**')
                .addFields(
                        {name: '- Total de miembros:', value: `**${totalMembers}**`},
                        {name: '- Miembros en línea:', value: `**${onlineMembers}**`},
                        {name: '- Bots:', value: `**${botCount}**`},
                        {name: '- Total de miembros:', value: `**${totalMembers}**`},
                        {name: '📁 **Canales:**', value: `- Canales de texto: **${textChannels}**
                        - Canales de voz: **${voiceChannels}**
                        `},
                        {name: '🎭 **Roles:**', value: `- Total de roles: **${rolesCount}**`},
                )

                message.channel.send({ embeds: [embed] });
        } catch (error) {
                console.error('Error ejecutando el comando %stats:', error);
                message.reply('Hubo un error al obtener las estadísticas del servidor.');
        }
}