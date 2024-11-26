// Apartado para enviar mensajes específicos a canales específicos
export async function run(message, client) {
    // Convierte el mensaje a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
    const lowerCaseMessage = message.content.toLowerCase();
    console.log(`Received message: ${lowerCaseMessage}`); // Mensaje de depuración

    // Verifica si el mensaje contiene la palabra "send"
    if (lowerCaseMessage.startsWith('!send')) { // Asegúrate de que el comando empiece con !send
        // Extrae el comando después de !send y divide los argumentos
        const args = message.content.slice(6).trim().split(/ +/); // `!send` tiene 6 caracteres
        console.log(`Arguments: ${args}`); // Mensaje de depuración

        const welcomeChannelId = args[0]; // El ID del canal es el primer argumento después de !send
        const query = args.slice(1).join(' '); // El mensaje es el resto de los argumentos unidos por un espacio

        if (!welcomeChannelId || !query) {
            console.log('Missing channel ID or message'); // Mensaje de depuración
            return message.reply('Please provide a channel ID and a message.');
        }

        try {
            const channel = await client.channels.fetch(welcomeChannelId);

            if (channel && channel.isText()) {
                // Enviar el mensaje al canal especificado
                await channel.send(query);
                console.log('Message sent successfully'); // Mensaje de depuración
                message.reply('Message sent successfully!');
            } else {
                console.log('Invalid channel ID or not a text channel'); // Mensaje de depuración
                message.reply('The provided channel ID is not valid or the channel is not a text channel.');
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            message.reply('Failed to send the message.');
        }
    }
}
