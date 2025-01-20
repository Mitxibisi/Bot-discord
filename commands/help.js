export async function run (message) {
        // Convierte el mensaje a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
        const lowerCaseMessage = message.content.toLowerCase();

        // Verifica si el mensaje contiene la palabra "help"
        if (lowerCaseMessage.includes('help')) {
            // Responde con un mensaje específico
            return message.reply(`**1. %audio "Texto que desea reproducir".
2. %clear Limpiara todos los canales del canal actual.
3. %perfil @usuario podras ver el perfil de otro usuario o el tuyo propio.
4. %reset Resetea su base de datos
5. %search Realiza una busqueda en internet y le devuelve el primer enlace obtenido.
**`);
        }
    }