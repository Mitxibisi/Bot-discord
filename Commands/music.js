import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import axios from "axios";
import ytSearch from "yt-search";
import { client } from "../index.js";
import puppeteer from 'puppeteer';

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

      descargarArchivo(youtubeUrl);

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

async function descargarArchivo(url) {
  const browser = await puppeteer.launch({ headless: true }); // Lanzamos el navegador en modo no oculto
  const page = await browser.newPage(); // Creamos una nueva página

  // Navegamos a la página de Cobalt Tools
  await page.goto('https://cobalt.tools/');

  // Esperamos que el campo de URL esté disponible
  await page.waitForSelector('input[name="url"]');
  
  // Escribimos la URL en el campo de entrada
  await page.type('input[name="url"]', url);

  // Esperamos que el botón de envío esté disponible y hacemos clic en él
  await page.waitForSelector('button[type="submit"]');
  await page.click('button[type="submit"]');

  // Esperamos un poco antes de cerrar el navegador para permitir la descarga
  await page.waitForTimeout(10000);

  await browser.close(); // Cerramos el navegador
}