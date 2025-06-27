// Importa la librería para programar tareas automáticas (cron jobs)
import schedule from 'node-schedule';
// Importa la instancia de la base de datos de usuarios
import { db } from '../Usersdb/database.js';
// Importa el constructor de embeds para mensajes enriquecidos
import { EmbedBuilder } from 'discord.js';
// Importa librería para generar colores aleatorios
import randomColor from 'randomcolor';
// Importa la instancia del cliente del bot
import { client } from '../index.js';
// Importa función para obtener configuraciones del servidor
import { getGuild } from '../GuildsConfig/configs.js';

// Mapa para rastrear y evitar tareas programadas duplicadas por servidor
const scheduledJobs = new Map();

// Función principal que configura el sistema de ranking para todos los servidores
export async function setupDeploymentList() {
    // Itera sobre todos los servidores donde está el bot
    client.guilds.cache.forEach(async (guild) => {
        await checkAndSetupDeployment(guild);
    });
}

// Función que verifica la configuración del servidor y configura el sistema de ranking
async function checkAndSetupDeployment(guild) {
    try {
        // Obtiene la configuración específica del servidor
        const GuildConfig = await getGuild(guild.id);
        let channelId = GuildConfig.ListDeploymentChannel;

        // CASO 1: No hay canal configurado - Sistema de espera inteligente
        if (!channelId) {
            console.log(`Esperando configuración del canal para ${guild.name}...`);

            // Función que verifica periódicamente si se configuró un canal
            const checkChannel = async () => {
                // Refresca la configuración del servidor
                const updatedConfig = await getGuild(guild.id);
                channelId = updatedConfig.ListDeploymentChannel;

                // Si finalmente se configuró un canal
                if (channelId) {
                    const channel = await client.channels.fetch(channelId).catch(() => null);
                    // Verifica que sea un canal de texto válido (type 0 = text channel)
                    if (channel && channel.type === 0) {
                        console.log(`Canal detectado para ${guild.name}. Configurando tarea...`);
                        await setupScheduledTask(guild, channel);
                    } else {
                        console.log(`Canal no válido en ${guild.id}`);
                    }
                }
            };

            // Programa verificación cada 30 segundos hasta que se configure el canal
            const interval = setInterval(checkChannel, 30000);
            
            // Ejecuta la verificación inmediatamente y limpia el intervalo cuando se configure
            checkChannel().then(() => clearInterval(interval));

            return; // Sale de la función porque no hay canal configurado aún
        }

        // CASO 2: Canal ya configurado - Configuración inmediata
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

// Función que configura la tarea programada para actualizar el ranking automáticamente
async function setupScheduledTask(guild, channel) {
    // Previene la creación de tareas duplicadas para el mismo servidor
    if (scheduledJobs.has(guild.id)) {
        console.log(`La tarea ya está programada para ${guild.name}`);
        return;
    }

    try {
        // Actualiza la lista inmediatamente al configurar
        await updateDeploymentList(channel, guild.id);

        // Programa la actualización automática cada hora (0 * * * *)
        // Formato cron: minuto hora día mes día-semana
        const job = schedule.scheduleJob(`0 * * * *`, async () => {
            console.log(`Actualizando la lista de ${guild.name}`);
            await updateDeploymentList(channel, guild.id);
        });

        // Registra la tarea en el mapa para evitar duplicados
        scheduledJobs.set(guild.id, job);
    } catch (error) {
        console.error(`Error al configurar la tarea para ${guild.name}:`, error.message);
    }
}

// Función que actualiza el embed del ranking en el canal configurado
async function updateDeploymentList(channel, guildId) {
    try {
        // Obtiene los top 100 usuarios del servidor específico
        const top100 = await getTop100(guildId);
        if (top100.length === 0) {
            console.error(`No hay usuarios en el ranking de ${channel.guild.name}`);
            return;
        }

        // Transforma los datos de usuarios en formato para mostrar
        const deploymentList = top100.map((user) => ({
            name: user.username.charAt(0).toUpperCase() + user.username.slice(1), // Capitaliza la primera letra
            level: `Nivel ${user.level}`,
        }));

        // Crea un embed atractivo con el ranking
        const embed = new EmbedBuilder()
            .setTitle(`🏆 Ranking de Nivel - ${channel.guild.name}`)
            .setColor(randomColor()) // Color aleatorio para cada actualización
            .setDescription(
                // Formatea cada usuario como "posición. nombre - nivel"
                deploymentList.map((item, index) => `**${index + 1}.** **${item.name}** - ${item.level}`).join('\n')
            )
            .setFooter({ text: '¡Sigue participando para mejorar tu ranking!' })
            .setTimestamp(); // Marca de tiempo de la última actualización

        // LIMPIEZA AUTOMÁTICA: Elimina mensajes anteriores del bot en el canal
        const messages = await channel.messages.fetch({ limit: 10 });
        // Filtra solo los mensajes enviados por este bot
        const messagesToDelete = messages.filter(message => message.author.id === client.user.id);
        await channel.bulkDelete(messagesToDelete);
        
        // Envía el nuevo embed actualizado
        await channel.send({ embeds: [embed] });

        console.log(`Ranking actualizado en ${channel.guild.name}`);
    } catch (error) {
        console.error(`Error al actualizar ranking en ${channel.guild.name}:`, error.message);
    }
}

// Función que consulta la base de datos para obtener el top 100 de usuarios
export async function getTop100(guildId) {
    try {
        // Consulta SQL que obtiene usuarios ordenados por nivel y experiencia
        const top100 = await db.all(
            `SELECT username, level, xp 
             FROM users 
             WHERE guild = ? 
             ORDER BY level DESC, xp DESC 
             LIMIT 100`, 
            [guildId] // Filtra solo usuarios de este servidor específico
        );

        // Retorna el array de usuarios o array vacío si no hay resultados
        return top100.length ? top100 : [];
    } catch (error) {
        console.error(`Error al obtener el Top 100 para guildId ${guildId}:`, error.message);
        return [];
    }
}