import { EmbedBuilder } from 'discord.js';

export async function run(message) {
    // Convierte el mensaje a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
    const lowerCaseMessage = message.content.toLowerCase();

    // Verifica si el mensaje contiene la palabra "help"
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#00ff00') // Verde brillante
                    .setTitle('✨ Comandos Disponibles ✨')
                    .setDescription(`
🎵 **%audio Texto que deseas decir**: Reproduce un texto en forma de audio.
👤 **%perfil**: Consulta tu perfil o el de otro usuario.
🔒 **%salaPriv**: Crea un canal de voz temporal y privado para ti. Se eliminará automáticamente si no hay usuarios conectados.
📊 **%stats**: Devuelve las estadísticas del servidor, incluyendo información sobre miembros, roles y más.
🔄 **%reset**: Resetea tu base de datos. (Solo admins)
🧹 **%clear**: Limpia todos los mensajes del canal actual. (Solo admins)
💡 **%addxp**: Añade experiencia al usuario o al usuario mencionado. (Solo admins)
👥 **%addAllPlayers**: Registra a todos los usuarios que aún no están en la base de datos. (Solo admins)
🔝 **%updateTop**: Actualiza el Ranking de jugadores a la última versión. (Solo admins)
                    `)
                    .setFooter({ 
                        text: 'GoodLife Help 🌟',  
                    })
            ]
        });
 }