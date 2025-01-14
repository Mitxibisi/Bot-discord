import { EmbedBuilder } from 'discord.js';
import randomColor from 'randomcolor';

export async function run(message, level) {
    const color = randomColor();
    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(`**Felicidades ${message.member.displayName} eres tan retrasado que en vez de subir en un juego al nivel ${level.toString()} lo has realizado en discord**`)
        .setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 1024}))

    message.channel.send({ embeds: [embed] });
    message.reply(`**GG ${message.member.displayName}, Felicidades eres tan puto retrasado que en vez de subir al nivel ${level.toString()} en un juego lo subes en discord paleto de playa**`);
}