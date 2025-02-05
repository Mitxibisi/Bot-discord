import schedule from 'node-schedule';
import { db } from '../Usersdb/database.js';
import { EmbedBuilder } from 'discord.js';
import randomColor from 'randomcolor';
import { client } from '../index.js';
import { getGuild } from '../GuildsConfig/configs.js'; // Para obtener configuraciones del servidor

// Configura la lista de despliegues y programa la actualización
export async function setupDeploymentList() {
    client.guilds.cache.forEach(async (guild) => {
        const GuildConfig = getGuild(guild.id);
        const channelId = GuildConfig.ListDeploymentChannel;

        if (!channelId) {
            console.log(`No hay un canal de despliegue configurado para ${guild.name}`);
            return;
        }

        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel || channel.type !== 0) {
                console.error(`Canal no válido en ${guild.name}`);
                return;
            }

            // Actualizar la lista inmediatamente
            await updateDeploymentList(channel, guild.id);

            // Programar la actualización diaria a las 12:00 AM (hora del servidor)
            schedule.scheduleJob(`0 0 * * *`, async () => {
                console.log(`Actualizando la lista de ${guild.name}`);
                await updateDeploymentList(channel, guild.id);
            });

        } catch (error) {
            console.error(`Error en ${guild.name}:`, error.message);
        }
    });
}

// Actualiza la lista de ranking para un servidor específico
async function updateDeploymentList(channel, guildId) {
    try {
        const top100 = await getTop100(guildId);
        if (top100.length === 0) {
            console.error(`No hay usuarios en el ranking de ${channel.guild.name}`);
            return;
        }

        const deploymentList = top100.map((user, index) => ({
            name: user.username.charAt(0).toUpperCase() + user.username.slice(1),
            level: `Nivel ${user.level}`,
        }));

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Ranking de Nivel - ${channel.guild.name}`)
            .setColor(randomColor())
            .setDescription(
                deploymentList.map((item, index) => `**${index + 1}.** **${item.name}** - ${item.level}`).join('\n')
            )
            .setFooter({ text: '¡Sigue participando para mejorar tu ranking!' })
            .setTimestamp();

        const messages = await channel.messages.fetch({ limit: 10 });
        await channel.bulkDelete(messages);
        await channel.send({ embeds: [embed] });

        console.log(`Ranking actualizado en ${channel.guild.name}`);
    } catch (error) {
        console.error(`Error al actualizar ranking en ${channel.guild.name}:`, error.message);
    }
}

// Obtiene el Top 100 usuarios de un servidor específico
export async function getTop100(guildId) {
    try {
        const top100 = await db.all(
            `SELECT username, level, xp 
             FROM users 
             WHERE guildId = ? 
             ORDER BY level DESC, xp DESC 
             LIMIT 100`, 
            [guildId] // Filtrado por servidor
        );

        return top100.length ? top100 : [];
    } catch (error) {
        console.error(`Error al obtener el Top 100 para guildId ${guildId}:`, error.message);
        return [];
    }
}