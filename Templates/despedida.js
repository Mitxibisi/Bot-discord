import fetch from 'node-fetch';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';
import { EmbedBuilder } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function run(member,Finalchannel) {
    try {
        const canvasWidth = 1000;
        const canvasHeight = 800;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        // Cargar la imagen de fondo
        const background = await loadImage(path.join(__dirname, 'background.png'));
        ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

        // Aumentar el tamaño del avatar
        const avatarSize = 300;  // Tamaño aumentado del avatar
        const borderSize = 10;   // Tamaño del borde blanco
        const totalAvatarSize = avatarSize + borderSize * 2;
        const avatarX = (canvasWidth / 2) - (totalAvatarSize / 2);
        const avatarY = ((canvasHeight / 2) - (canvasHeight / 2) / 2) - (totalAvatarSize / 2);

        // Dibuja el borde blanco
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + totalAvatarSize / 2, avatarY + totalAvatarSize / 2, totalAvatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(avatarX, avatarY, totalAvatarSize, totalAvatarSize);
        ctx.restore();

        // Dibuja el avatar del usuario
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + totalAvatarSize / 2, avatarY + totalAvatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const avatarURL = member.user.displayAvatarURL({ dynamic: true, format: 'webp', size: 512 });
        const response = await fetch(avatarURL);
        if (!response.ok) throw new Error('No se pudo descargar el avatar');

        const arrayBuffer = await response.arrayBuffer();
        const avatarBuffer = Buffer.from(arrayBuffer);
        const avatarPNGBuffer = await sharp(avatarBuffer).toFormat('png').toBuffer();
        const avatar = await loadImage(avatarPNGBuffer);
        ctx.drawImage(avatar, avatarX + borderSize, avatarY + borderSize, avatarSize, avatarSize);

        ctx.restore();

        // Agregar el texto con el nombre de usuario
        ctx.font = 'bold 100px "ComicNeueSansID"';
        ctx.fillStyle = 'black'; // Color del texto blanco
        ctx.textAlign = 'center';

        const username = member.user.username;
        const text = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
        const textX = canvasWidth / 2;
        const textY = (canvasHeight / 2) + 50;

        ctx.fillText(text, textX, textY);

        ctx.restore();

        // Agregar el texto con el nombre de usuario
        ctx.font = 'bold 72px "ComicNeueSansID"';
        ctx.fillStyle = 'black'; // Color del texto
        ctx.textAlign = 'center';

        const text1 = ('HASTA');
        const textX1 = canvasWidth / 2;
        const textY1 = (canvasHeight / 2) + (((canvasHeight / 2) / 2) + 100);

	const text2 = ('PRONTO');
        const textX2 = canvasWidth / 2;
        const textY2 = (canvasHeight / 2) + (((canvasHeight / 2) / 2) + 160);

        ctx.fillText(text1, textX1, textY1);
	ctx.fillText(text2, textX2, textY2);

	ctx.restore();

        // Enviar la imagen como adjunto
        const attachment = canvas.toBuffer();
        const attachmentName = 'profile-image.png';

        const embed = new EmbedBuilder()
            .setColor(0x006400)
            .setImage('attachment://' + attachmentName);

         await Finalchannel.send({
            embeds: [embed],
            files: [{ attachment, name: attachmentName }]
        });
    } catch (error) {
        console.error('Error al generar el perfil:', error);
        Finalchannel.send('Hubo un error al generar tu perfil.');
    }
}