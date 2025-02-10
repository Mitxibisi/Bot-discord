import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import axios from "axios";
import ytSearch from "yt-search";
import { client } from "../index.js";

export async function run(message) {
    const query = message.content.replace("%music ", "").trim();

    if (!message.member.voice.channel) {
        return message.reply("¡Debes estar en un canal de voz!");
    }

    try {
        // Buscar video en YouTube
        const searchResults = await ytSearch(query);
        if (!searchResults.videos.length) {
            return message.reply("No encontré resultados en YouTube.");
        }

        const video = searchResults.videos[0];
        const youtubeUrl = video.url;

        // Obtener enlace de audio con Cobalt
        const cobaltResponse = await axios.get("https://cobalt.tools/api/youtube", {
            params: { url: youtubeUrl }
        });

        if (!cobaltResponse.data.url) {
            return message.reply("No se pudo obtener el audio.");
        }

        const audioUrl = cobaltResponse.data.url;

        // Conectar al canal de voz
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        // Crear y reproducir el audio
        const player = createAudioPlayer();
        const resource = createAudioResource(audioUrl);
        player.play(resource);
        connection.subscribe(player);

        // Desconectar al terminar
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        message.reply(`Reproduciendo: **${video.title}**`);
    } catch (error) {
        console.error(error);
        message.reply("Hubo un error al buscar la música.");
    }
}