//Apartado para enviar mensajes especificos a canales especificos
export async function run(message, client) {
        // Convierte el mensaje a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
        const lowerCaseMessage = message.content.toLowerCase();

        // Verifica si el mensaje contiene la palabra "help"
    if (lowerCaseMessage.includes('send')) {
        const args = message.content.slice(1).split(' ')[1];  // Extrae el comando después del punto
        const welcomeChannelId = args;
            const channel = await client.channels.fetch(welcomeChannelId);

            channel.send('iker gey')
        }
    }