import gtts from 'gtts';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import fs from 'fs';

export async function run(message) {
    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
        return message.reply('Debes estar en un canal de voz para usar este comando.');
    }

    const content = message.content.trim(); // Obtén el contenido completo del mensaje
    const prefix = '%audio'; // Define el prefijo para el comando

    const text = content.slice(prefix.length).trim(); // Extrae el texto después de '%audio'

    if (!text) {
        return message.reply('Por favor, proporciona un mensaje después de "%audio" para reproducir.');
    }

    const gttsInstance = new gtts(text, 'es'); // 'es' para español
    const filePath = `./temp_message_${Date.now()}.mp3`; // Usa un nombre único para el archivo temporal

    try {
        // Genera el archivo de audio
        gttsInstance.save(filePath, async () => {
            console.log('Archivo de audio generado:', filePath);

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            const resource = createAudioResource(filePath);
            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, () => {
                player.stop();
                connection.destroy();
                fs.unlinkSync(filePath); // Elimina el archivo temporal
                console.log('Archivo de audio eliminado:', filePath);
            });

            message.reply('Reproduciendo mensaje en el canal de voz.');
        });
    } catch (error) {
        console.error('Error al reproducir el mensaje:', error);
        message.reply('Hubo un error al intentar reproducir el mensaje.');
    }
}