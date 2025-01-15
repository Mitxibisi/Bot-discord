import schedule from 'node-schedule'; // Asegúrate de instalarlo con `npm install node-schedule`
import { db } from './database.js';

/**
 * Configura la lista de despliegues y actualiza automáticamente.
  * @param {Client} client - El cliente de Discord.js.
   * @param {string} channelId - ID del canal donde se actualizará la lista.
    */
    async function setupDeploymentList(client, channelId) {
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
                                                                                   // Aquí defines los elementos de la lista
                                                                                           const deploymentList = [
                                                                                                       { name: 'Servicio A', status: 'En línea' },
                                                                                                                   { name: 'Servicio B', status: 'En mantenimiento' },
                                                                                                                               { name: 'Servicio C', status: 'Error' }
                                                                                                                                       ];

                                                                                                                                               // Construir el mensaje
                                                                                                                                                       const formattedList = deploymentList.map((item, index) => 
                                                                                                                                                                   `**${index + 1}. ${item.name}:** ${item.status}`
                                                                                                                                                                           ).join('\n');

                                                                                                                                                                                   const messageContent = `**Lista de Despliegues:**\n\n${formattedList}`;

                                                                                                                                                                                           // Borra mensajes previos y envía la nueva lista
                                                                                                                                                                                                   const messages = await channel.messages.fetch({ limit: 10 });
                                                                                                                                                                                                           await channel.bulkDelete(messages);
                                                                                                                                                                                                                   await channel.send(messageContent);

                                                                                                                                                                                                                           console.log('Lista de despliegues actualizada correctamente.');
                                                                                                                                                                                                                               } catch (error) {
                                                                                                                                                                                                                                       console.error('Error al actualizar la lista de despliegues:', error.message);
                                                                                                                                                                                                                                           }
                                                                                                                                                                                                                                           }

                                                                                                                                                                                                                                           // Exporta la función para usarla en otros archivos si es necesario
                                                                                                                                                                                                                                           export { setupDeploymentList };
