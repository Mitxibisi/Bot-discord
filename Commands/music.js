import { GatewayIntentBits } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import axios from "axios";
import { client } from '../index.js';

export async function run(message){
    const query = message.content.replace("%music ", "").trim();
    const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    try {
        // Buscar video en YouTube
        const response = await axios.get(ytSearchUrl);
        const videoId = response.data.match(/"videoId":"(.*?)"/)[1]; 
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Obtener enlace de audio con Cobalt
        const cobaltResponse = await axios.post("https://cobalt.tools/api/youtube", { url: youtubeUrl });
        const audioUrl = cobaltResponse.data.url;

        // Conectar al canal de voz
        if (message.member.voice.channel) {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            // Crear y reproducir el audio
            const player = createAudioPlayer();
            const resource = createAudioResource(audioUrl);
            player.play(resource);
            connection.subscribe(player);
        } else {
            message.reply("¡Debes estar en un canal de voz!");
        }
    } catch (error) {
        console.error(error);
        message.reply("Hubo un error al buscar el video.");
    }
}