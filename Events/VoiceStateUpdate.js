// Importa la función para obtener la configuración de un servidor
import { getGuild } from "../GuildsConfig/configs.js";
// Importa la función para agregar experiencia a los usuarios
import { addXp } from "../Usersdb/database.js";
// Importa la instancia del cliente desde el archivo principal
import { client } from '../index.js';

// Mapa para rastrear cuándo cada usuario entra a un canal de voz
// Clave: userId, Valor: timestamp de entrada
const userVoiceTimes = new Map();

// Función por defecto que registra el evento de cambios en canales de voz
export default () => {
    // Evento que se ejecuta cuando hay cambios en el estado de voz de los usuarios
    // oldState: estado anterior, newState: estado nuevo
    client.on('voiceStateUpdate', async (oldState, newState) => {
        try{
            const guildId = newState.guild.id;
            const Guild = await getGuild(guildId);
            const userId = newState.id;
            // Obtiene el GuildMember desde cualquiera de los dos estados
            const guildMember = newState.member || oldState.member;
            // Canal de voz que debe ser ignorado (configurado por el servidor)
            const ignoredChannelId = Guild.IgnoredChannelId;
        
            // FILTRO 1: Ignorar bots
            if (guildMember.user.bot) {
                return;
            }
        
            // FILTRO 2: Ignorar usuarios silenciados (mute)
            // Si está silenciado en el nuevo estado Y (no estaba en canal O estaba silenciado antes)
            if ((newState.selfMute || newState.serverMute) && (!oldState.channelId || oldState.selfMute || oldState.serverMute)) {
                return;
            }
        
            // CASO 1: Usuario ENTRA a un canal de voz
            // No estaba en canal antes Y ahora está en un canal
            if (!oldState.channelId && newState.channelId) {
                // No procesa el canal ignorado configurado
                if (newState.channelId === ignoredChannelId) {
                    return;
                }
                // Registra el momento exacto de entrada
                userVoiceTimes.set(userId, Date.now());
            }
        
            // CASO 2: Usuario SALE de un canal de voz
            // Estaba en un canal antes Y ahora no está en ningún canal
            else if (oldState.channelId && !newState.channelId) {
                const enterTime = userVoiceTimes.get(userId);
                if (enterTime) {
                    // Calcula el tiempo que estuvo en el canal (en segundos)
                    const elapsedTime = (Date.now() - enterTime) / 1000;

                    // Verificación adicional: ignorar si salió del canal ignorado
                    if (oldState.channelId === ignoredChannelId) {
                        userVoiceTimes.delete(userId);
                        return;
                    }
                
                    // Obtiene el canal configurado para mensajes de actividad de voz
                    const channelId = Guild.VoiceMessagesChannel;
                    try {
                        const channel = await client.channels.fetch(channelId);
                        if (!channel.isTextBased()) {
                            console.error('El canal especificado no es de texto.');
                            return;
                        }

                        // RECOMPENSA ESPECIAL: Rol secreto por 8 horas continuas (28800 segundos)
                        if (elapsedTime >= 28800){
                            await guildMember.roles.add(Guild.SecretRolId1);
                            channel.send('Alguien obtuvo el rol secreto');
                            return;
                        }
                    
                        // OTORGAMIENTO DE EXPERIENCIA POR TIEMPO EN VOZ
                        // 0.1 XP por segundo = 6 XP por minuto
                        await addXp(guildId, userId, Math.ceil(elapsedTime * 0.1), guildMember, null, channel);
                    
                        // Limpia el registro de tiempo de entrada
                        userVoiceTimes.delete(userId);
                    } catch (error) {
                        console.error('Error al obtener el canal:', error);
                    }
                }
            }
        
            // GESTIÓN DE CANALES TEMPORALES
            // Si el usuario salió de un canal Y ese canal está marcado como temporal
            if (oldState.channelId && global.temporaryChannels.has(oldState.channelId)) {
                const channel = await client.channels.fetch(oldState.channelId);
                
                // Programa la eliminación del canal si queda vacío
                setTimeout(async () => {
                    try {
                        // Vuelve a verificar el canal después del timeout
                        const fetchedChannel = await client.channels.fetch(channel.id);
                        // Si el canal existe Y está vacío, lo elimina
                        if (fetchedChannel && fetchedChannel.members.size === 0) {
                            await fetchedChannel.delete(
                                'Canal temporal eliminado automáticamente por estar vacío.'
                            );
                            // Limpia el canal del conjunto de canales temporales
                            global.temporaryChannels.delete(channel.id);
                        }
                    } catch (error) {
                        // Error 10003 = Canal no encontrado (ya fue eliminado)
                        if (error.code === 10003) {
                            console.log(`El canal ${channel.id} ya no existe.`);
                            global.temporaryChannels.delete(channel.id);
                        } else {
                            console.error(`Error al eliminar el canal ${channel.id}:`, error);
                        }
                    }
                }, 30000); // Espera 30 segundos antes de eliminar
            }
        }catch(error){
            // Captura cualquier error en el procesamiento del evento
            console.log('Error al ejecutar voicestateupdate: ',error);
        }
    });
};