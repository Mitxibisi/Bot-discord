import { addXp } from "../Usersdb/database.js";
import { client, config } from '../index.js';

// Un mapa para rastrear la actividad de entrada y salida de los usuarios de los canalez de voz
const userVoiceTimes = new Map();

export default () => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        try{
            const guildId = newState.guild.id;
            const userId = newState.id;
            const guildMember = newState.member || oldState.member; // Obtén el miembro del servidor
            const ignoredChannelId = config.IgnoredChannelId; // ID del canal a ignorar
        
            // Ignorar si el usuario es un bot
            if (guildMember.user.bot) {
            return;
            }
        
            // Ignorar si el usuario está silenciado en ambos estados
            if ((newState.selfMute || newState.serverMute) && (!oldState.channelId || oldState.selfMute || oldState.serverMute)) {
            return;
            }
        
            // Si el usuario entra en un canal de voz
            if (!oldState.channelId && newState.channelId) {
            // Ignorar el canal específico
            if (newState.channelId === ignoredChannelId) {
            return;
            }
            userVoiceTimes.set(userId, Date.now()); // Guardamos el tiempo de entrada
            }
        
            // Si el usuario sale de un canal de voz
            else if (oldState.channelId && !newState.channelId) {
            const enterTime = userVoiceTimes.get(userId);
            if (enterTime) {
            const elapsedTime = (Date.now() - enterTime) / 1000; // Tiempo en segundos
        
            // Ignorar el canal específico
            if (oldState.channelId === ignoredChannelId) {
            userVoiceTimes.delete(userId);
            return;
            }
        
            const channelId = config.VoiceMessagesChannel;
            try {
            const channel = await client.channels.fetch(channelId); // Espera a que se resuelva la promesa
            if (!channel.isTextBased()) {
            console.error('El canal especificado no es de texto.');
            return;
            }
        
            await addXp(guildId, userId, Math.ceil(elapsedTime * 0.1), guildMember, null, channel);
        
            // Borra el tiempo de entrada del usuario
            userVoiceTimes.delete(userId);
            } catch (error) {
            console.error('Error al obtener el canal:', error);
            }
            }
            }
        
            if (oldState.channelId && global.temporaryChannels.has(oldState.channelId)) {
                const channel = await client.channels.fetch(oldState.channelId);
                
                // Si el canal queda vacío, programar su eliminación
        
        setTimeout(async () => {
            try {
                const fetchedChannel = await client.channels.fetch(channel.id);
                if (fetchedChannel && fetchedChannel.members.size === 0) {
                    await fetchedChannel.delete(
                        'Canal temporal eliminado automáticamente por estar vacío.'
                    );
                    global.temporaryChannels.delete(channel.id); // Limpia el conjunto
                }
            } catch (error) {
                if (error.code === 10003) {
                    console.log(`El canal ${channel.id} ya no existe.`);
                    global.temporaryChannels.delete(channel.id); // Limpia el conjunto
                } else {
                    console.error(`Error al eliminar el canal ${channel.id}:`, error);
                }
            }
        }, 30000); // 30 segundos
                }
        }catch(error){
            console.log('Error al ejecutar voicestateupdate: ',error);
        }
    });
};