import schedule from 'node-schedule';
import { db } from '../Usersdb/database.js';
import { EmbedBuilder } from 'discord.js';
import randomColor from 'randomcolor';
import { client } from '../index.js';
import { getGuild } from '../GuildsConfig/configs.js'; // Para obtener configuraciones del servidor

const scheduledJobs = new Map(); // Mapa para rastrear tareas programadas

export async function setupDeploymentList() {
    client.guilds.cache.forEach(async (guild) => {
        await checkAndSetupDeployment(guild);
    });
}

async function checkAndSetupDeployment(guild) {
    try {
        const GuildConfig = await getGuild(guild.id);
        let channelId = GuildConfig.ListDeploymentChannel;

        // Si no hay canal configurado, verificar cada 30 segundos
        if (!channelId) {
            console.log(`Esperando configuración del canal para ${guild.name}...`);

            const checkChannel = async () => {
                const updatedConfig = await getGuild(guild.id);
                channelId = updatedConfig.ListDeploymentChannel;

                if (channelId) {
                    const channel = await client.channels.fetch(channelId).catch(() => null);
                    if (channel && channel.type === 0) {
                        console.log(`Canal detectado para ${guild.name}. Configurando tarea...`);
                        await setupScheduledTask(guild, channel);
                    } else {
                        console.log(`Canal no válido en ${guild.id}`);
                    }
                }
            };

            // Comprobar el canal cada 30 segundos
            const interval = setInterval(checkChannel, 30000);
            
            // Detener la verificación si ya se configuró el canal
            checkChannel().then(() => clearInterval(interval));

            return;
        }

        // Si el canal ya está configurado, configurarlo de inmediato
        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (channel && channel.type === 0) {
            await setupScheduledTask(guild, channel);
        } else {
            console.log(`Canal no válido en ${guild.name}`);
        }
    } catch (error) {
        console.error(`Error en ${guild.name}:`, error.message);
    }
}

async function setupScheduledTask(guild, channel) {
    // Evita tareas duplicadas
    if (scheduledJobs.has(guild.id)) {
        console.log(`La tarea ya está programada para ${guild.name}`);
        return;
    }

    try {

        // Actualiza la lista inmediatamente
        await updateDeploymentList(channel, guild.id);

        // Programa la actualización diaria a las 12:00 AM
        const job = schedule.scheduleJob(`0 * * * *`, async () => {
            console.log(`Actualizando la lista de ${guild.name}`);
            await updateDeploymentList(channel, guild.id);
        });

        scheduledJobs.set(guild.id, job);
    } catch (error) {
        console.error(`Error al configurar la tarea para ${guild.name}:`, error.message);
    }
}

// Actualiza la lista de ranking para un servidor específico
async function updateDeploymentList(channel, guildId) {
    try {
        const top100 = await getTop100(guildId);
        if (top100.length === 0) {
            console.error(`No hay usuarios en el ranking de ${channel.guild.name}`);
            return;
        }

        const deploymentList = top100.map((user) => ({
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
        const messagesToDelete = messages.filter(message => message.author.id === client.user.id); // Filtrar por el autor del bot
        await channel.bulkDelete(messagesToDelete);            
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
             WHERE guild = ? 
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