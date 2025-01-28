import schedule from 'node-schedule'; // Asegúrate de instalarlo con `npm install node-schedule`
import { db } from '../Usersdb/database.js';
import { EmbedBuilder } from 'discord.js'; // Importa el objeto Embed
import randomColor from 'randomcolor';

//Este codigo es puro chatgpt con modificaciones y algunas correciones (estudiarse el codigo)

/**
* Configura la lista de despliegues y actualiza automáticamente.
* @param {Client} client - El cliente de Discord.js.
* @param {string} channelId - ID del canal donde se actualizará la lista.
*/

export async function setupDeploymentList(client, channelId) {
        const channel = await client.channels.fetch(channelId);
            if (!channel || channel.type !== 0) { // Asegúrate de que sea un canal de texto.
                console.error(`No se encontró un canal de texto con ID ${channelId}`);
                return;
                }

        // Actualizar la lista inmediatamente al configurar
        await updateDeploymentList(channel);

        // Programar la actualización diaria a las 12:00 AM
                schedule.scheduleJob('0 * * * *', async () => {
                console.log('Actualizando la lista de despliegues...');
                await updateDeploymentList(channel);
        });
}

/**
* Actualiza la lista de despliegues en el canal especificado.
* @param {TextChannel} channel - El canal donde se enviará la lista.
*/

async function updateDeploymentList(channel) {
    try {
        const top100 = await getTop100();
        if (top100.length === 0) {
            console.error('No se encontraron usuarios en el ranking.');
            return;
        }
        
        // Crear la lista usando los datos del top 10
        const deploymentList = await Promise.all(
                top100.slice(0, 10).map((user, index) => {
                // Asegurarse de que la primera letra del nombre de usuario esté en mayúscula
                const usernameWithCapital = user.username.charAt(0).toUpperCase() + user.username.slice(1);
                return {
                        name: usernameWithCapital,  // Usamos el nombre con la primera letra en mayúscula
                        level: `Nivel ${user.level}`,  // Usamos `user.level` para acceder al nivel
                };
                })
        );
    

        // Crear el embed para la lista de ranking
        const embed = new EmbedBuilder()
            .setTitle('🏆 **Ranking de Nivel**')
            .setColor(randomColor()) // Color aleatorio
            .setDescription(
                deploymentList
                    .map((item, index) => `**${index + 1}.** **${item.name}** - ${item.level}`)
                    .join('\n')
            )
            .setFooter({text:'¡Continúa participando para mejorar tu ranking!'})
            .setTimestamp();

        // Borra mensajes previos y envía la nueva lista
        const messages = await channel.messages.fetch({ limit: 10 });
        await channel.bulkDelete(messages);
        await channel.send({ embeds: [embed] });
        console.log('Lista de ranking actualizada correctamente.');
    } catch (error) {
        console.error('Error al actualizar la lista de ranking:', error.message);
    }
}

// Función para obtener el Top 100 usuarios
export async function getTop100() {
        try {
            const top100 = await db.all(
                `SELECT username, level, xp 
                 FROM users 
                 ORDER BY level DESC, xp DESC 
                 LIMIT 100`
            );
    
            if (top100.length > 0) {
                console.log('Top 100 usuarios obtenidos correctamente:');
                top100.forEach((user, index) => {
                    console.log(`${index + 1}. ${user.username} - Nivel: ${user.level}, XP: ${user.xp}`);
                });
                return top100;
            } else {
                console.log('No hay usuarios en la base de datos.');
                return [];
            }
        } catch (error) {
            console.error('Error al obtener el Top 100:', error.message);
            return [];
        }
}    