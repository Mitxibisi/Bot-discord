module.exports = {
    description: 'Detecta la palabra "help" y responde con un mensaje específico',
    run: async (message) => {
        // Convierte el mensaje a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
        const lowerCaseMessage = message.content.toLowerCase();

        // Verifica si el mensaje contiene la palabra "help"
        if (lowerCaseMessage.includes('help')) {
            // Responde con un mensaje específico
            return message.reply('Buenas, ahora mismo este bot no dispone de comandos realmente utiles');
        }
        if (lowerCaseMessage.includes('iker')) {
            // Responde con un mensaje específico
            return message.reply('Ser extraño que rara vez se le ha visto, se cree que esta extinto a dia de hoy');
        }
        if (lowerCaseMessage.includes('alain')) {
            // Responde con un mensaje específico
            return message.reply('Ser extremadamente sexy con tremento baston');
        }
        if (lowerCaseMessage.includes('martin')) {
            // Responde con un mensaje específico
            return message.reply('Solo sirve para hacerte reir');
        }
    }
};