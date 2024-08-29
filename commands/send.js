module.exports = {
    description: 'Detecta la palabra "help" y responde con un mensaje específico',
    run: async (message,client) => {
        // Convierte el mensaje a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
        const lowerCaseMessage = message.content.toLowerCase();

        // Verifica si el mensaje contiene la palabra "help"
        if (lowerCaseMessage.includes('iker')) {
            const welcomeChannelId = '731926366131453982';
            const channel = await client.channels.fetch(welcomeChannelId);

            channel.send('iker gey')
        }
    }
};