export async function run(message, client, config) {
    // Verifica que el mensaje viene de un servidor
    if (!message.guild) {
        return message.reply("Este comando solo se puede usar en un servidor.");
    }

    // Obtener el nombre del canal temporal
    const channelName = `Canal Temporal - ${message.author.username}`;

    try {
        // Crear el canal de voz temporal
        const channel = await message.guild.channels.create({
            name: channelName,
            type: 2, // Tipo 2 corresponde a un canal de voz
            parent: config.TemporalChannelsId,
            permissionOverwrites: [
                {
                    id: message.guild.id, // Permisos para todos los miembros
                    allow: ['ViewChannel', 'Connect', 'Speak'],
                },
                {
                    id: message.author.id, // Permisos para el creador del canal
                    allow: ['ManageChannels', 'Connect', 'Speak'],
                },
            ],
        });

        // Responder con la información del canal creado
        // Responder con la información del canal creado
        message.reply(`Canal de voz creado: ${channelName}. Se eliminará automáticamente si nadie se une en 30 segundos.`);

        // Iniciar un temporizador de 30 segundos para eliminar el canal si está vacío
        const deleteTimeout = setTimeout(async () => {
            const fetchedChannel = await client.channels.fetch(channel.id);
            if (fetchedChannel.members.size === 0) {
                await fetchedChannel.delete('Canal temporal eliminado automáticamente porque no se unió nadie.');
            }
        }, 30000); // 30 segundos

        // Escuchar el evento de los miembros que se unen al canal
        const voiceStateUpdateHandler = async (oldState, newState) => {
            if (newState.channelId === channel.id && newState.member.id !== message.author.id) {
                // Si alguien se une, cancelar el temporizador de eliminación
                clearTimeout(deleteTimeout);
            }
        };

        // Registrar el evento para monitorear el canal
        client.on('voiceStateUpdate', voiceStateUpdateHandler);

    } catch (error) {
        console.error("Error al crear el canal temporal:", error);
        message.reply("Hubo un error al intentar crear el canal temporal.");
    }
}