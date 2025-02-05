import { client } from '../index.js';
import { getGuild } from '../GuildsConfig/configs.js';

export async function run(message) {
        if (!message.guild) {
        return message.reply("Este comando solo se puede usar en un servidor.");
        }
        
        const channelName = `Canal Temporal - ${message.author.username}`;
        
        try {
        const Guild = await getGuild(message.guild.id);
        const channel = await message.guild.channels.create({
        name: channelName,
        type: 2, // Tipo 2 corresponde a un canal de voz
        parent: Guild.TemporalChannelsId,
        permissionOverwrites: [
        {
        id: message.guild.id,
        allow: ['ViewChannel', 'Connect', 'Speak'],
        },
        {
        id: message.author.id,
        allow: ['ManageChannels', 'Connect', 'Speak'],
        },
        ],
        });
        
        // Responder al usuario
        message.reply(
        `Canal de voz creado: ${channelName}. Si queda vacío, se eliminará automáticamente en 30 segundos.`
        );
        
        // Añadir el canal al conjunto global
        global.temporaryChannels.add(channel.id);
        
        // Iniciar un temporizador para verificar si el canal está vacío tras 30 segundos
        setTimeout(async () => {
        try {
        const fetchedChannel = await client.channels.fetch(channel.id);
        if (fetchedChannel && fetchedChannel.members.size === 0) {
        await fetchedChannel.delete('Canal temporal eliminado automáticamente por estar vacío.');
        global.temporaryChannels.delete(channel.id); // Eliminar del conjunto global
        }
        } catch (error) {
        console.error(`Error al eliminar el canal temporal ${channelName}:`, error);
        }
        }, 30000); // 30 segundos
        
        } catch (error) {
        console.error('Error al crear el canal temporal:', error);
        message.reply('Hubo un error al intentar crear el canal temporal.');
        }
}        