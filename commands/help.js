export async function run (message) {
        // Convierte el mensaje a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
        const lowerCaseMessage = message.content.toLowerCase();

        // Verifica si el mensaje contiene la palabra "help"
        if (lowerCaseMessage.includes('help')) {
            // Responde con un mensaje específico
            return message.reply('1. Comando para limpieza de un canal entero: .clear');
        }
    }