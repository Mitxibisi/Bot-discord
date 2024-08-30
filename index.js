import fetch from 'node-fetch';
import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import { Client, Events, EmbedBuilder, GatewayIntentBits } from 'discord.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Función para limpiar el canal
async function clearChannel(channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
            console.error('El canal no es de texto o no se pudo encontrar.');
            return;
        }

        let messages;
        do {
            messages = await channel.messages.fetch({ limit: 100 });
            for (const msg of messages.values()) {
                try {
                    await msg.delete();
                } catch (error) {
                    console.error(`Error al eliminar el mensaje con ID ${msg.id}:`, error);
                }
            }
        } while (messages.size > 0);

        console.log('Canal limpio con éxito.');
    } catch (error) {
        console.error('Error al limpiar el canal:', error);
    }
}

// Manejo de eventos
client.on(Events.ClientReady, () => {
    console.log(`Conectado como ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('¿clear')) {
        await clearChannel(message.channel.id);
        return message.channel.send('Channel cleared!').then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    }

    if (message.content.startsWith('.')) {
        const args = message.content.slice(1).split(' ')[0];
        try {
            const command = require(`./commands/${args}`);
            command.run(message, client);
        } catch (error) {
            console.log(`Error general al usar el comando ${args}`, error.message);
            return message.reply("Sin comando seleccionado");
        }
    }

    if (message.content === '!embed') {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Título del Embed')
            .setDescription('Esta es la descripción del embed.')
            .setThumbnail('https://t3.ftcdn.net/jpg/03/18/01/96/360_F_318019685_EV3M47BKGuK3iFG5cOQmVjPy15bc7CkC.jpg')
            .addFields(
                { name: 'Campo 1', value: 'Este es el valor del campo 1' },
                { name: 'Campo 2', value: 'Este es el valor del campo 2' },
                { name: 'Campo en línea', value: 'Este campo está en línea', inline: true },
                { name: 'Otro campo en línea', value: 'Este también está en línea', inline: true }
            )
            .setFooter({ text: 'Este es un pie de página', iconURL: 'https://t3.ftcdn.net/jpg/03/18/01/96/360_F_318019685_EV3M47BKGuK3iFG5cOQmVjPy15bc7CkC.jpg' });

        message.channel.send({ embeds: [embed] });
    }

    if (message.content === '!profile') {
        try {
            // Definir el tamaño del canvas
            const canvasWidth = 1000;
            const canvasHeight = 800;

            // Crear un canvas con el tamaño especificado
            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext('2d');

            // Cargar la imagen de fondo
            const background = await loadImage(path.join(__dirname, 'background.png'));
            ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

            // Dibujar un círculo para la imagen del avatar
            const avatarSize = 200;
            const avatarX = (canvasWidth / 2) - (avatarSize / 2);
            const avatarY = (canvasHeight / 2) - (avatarSize / 2);

            ctx.save(); // Guardar el contexto antes de aplicar el clipping
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Descargar y convertir la imagen del avatar
            const avatarURL = message.author.displayAvatarURL({ format: 'webp', size: 1024 });
            const response = await fetch(avatarURL);
            if (!response.ok) throw new Error('No se pudo descargar el avatar');

            // Convertir el ArrayBuffer a Buffer
            const arrayBuffer = await response.arrayBuffer();
            const avatarBuffer = Buffer.from(arrayBuffer);

            // Convertir la imagen a PNG usando sharp
            const avatarPNGBuffer = await sharp(avatarBuffer).toFormat('png').toBuffer();
            const avatar = await loadImage(avatarPNGBuffer);
            ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

            ctx.restore(); // Restaurar el contexto después de recortar la imagen del avatar

            // Configurar el estilo del texto
            ctx.font = '100px Arial'; // Tamaño y tipo de fuente
            ctx.fillStyle = '#D2D2CA'; // Color del texto
            ctx.textAlign = 'center'; // Alinear el texto al centro

            // Texto para mostrar debajo del avatar
            const text = message.author.username;

            // Calcular la posición del texto
            const textX = canvasWidth / 2;
            const textY = (canvasHeight / 2) + ((canvasHeight/ 2) / 2); // Ajusta la posición vertical del texto

            // Dibujar el texto en el canvas
            ctx.fillText(text, textX, textY);

            // Convertir el canvas en un buffer y adjuntarlo como imagen al embed
            const attachment = canvas.toBuffer();
            const attachmentName = 'profile-image.png';

            // Crear y enviar el embed
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Perfil de Usuario')
                .setDescription(`${message.author.username}`)
                .setImage('attachment://' + attachmentName)
                .setFooter({ text: 'Generado automáticamente' });

            await message.channel.send({
                embeds: [embed],
                files: [{ attachment, name: attachmentName }]
            });
        } catch (error) {
            console.error('Error al generar el perfil:', error);
            message.reply('Hubo un error al generar tu perfil.');
        }
    }
});

client.on(Events.GuildMemberAdd, async (member) => {
    const welcomeChannelId = '732006205454811206';
    const channel = await client.channels.fetch(welcomeChannelId);

    if (channel) {
        channel.send(`**<@${member.user.id}> bienvenido a la comunidad**`);
    }
});

client.on(Events.GuildMemberRemove, async (member) => {
    const welcomeChannelId = '732006205454811206';
    const channel = await client.channels.fetch(welcomeChannelId);

    if (channel) {
        channel.send(`**<@${member.user.id}> Y SE MARCHOO**`);
    }
});

client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.G6Kk3N.Q_Ypo8lh4MU3TeJA7PY3gHTCJ_66Sm5CfEhxfU");
