import { client } from '../index.js'
import { getGuild } from '../GuildsConfig/configs.js'

async function clearChannel(channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
            console.error('El canal no es de texto o no se pudo encontrar.');
            return;
        }

        let messages;
        do {
            messages = await channel.messages.fetch({ limit: 100 });
            for (const msg of messages.values()) {
                try {
                    await msg.delete();
                } catch (error) {
                    console.error(`Error al eliminar el mensaje con ID ${msg.id}:`, error);
                }
            }
        } while (messages.size > 0);

        console.log('Canal limpio con éxito.');
    } catch (error) {
        console.error('Error al limpiar el canal:', error);
    }
}

export async function run(message) {
    if (message.content.startsWith('%clear')) {
        await clearChannel(message.channel.id);
        return message.channel.send('Channel cleared!').then(msg => {
            setTimeout(() => msg.delete(), 5000);
        })
    } else {
    // El usuario no tiene el rol requerido
    return message.reply('No tienes los permisos necesarios para ejecutar este comando.');
    }
}