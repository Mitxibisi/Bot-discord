import fetch from 'node-fetch';
import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import { Client, Events, EmbedBuilder, GatewayIntentBits } from 'discord.js';
import { fileURLToPath } from 'url';
import { exec, execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on(Events.ClientReady, () => {
    console.log(`Conectado como ${client.user.tag}!`);
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

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('.')) {
        const args = message.content.slice(1).split(' ')[0];  // Extrae el comando después del punto
        try {
            console.log(`Intentando cargar el comando: ${args}`);
            // Intenta cargar el módulo del comando
            const commandPath = `./commands/${args}.js`;
            const commandModule = await import(commandPath);
            console.log(`Módulo cargado desde: ${commandPath}`);
            if (typeof commandModule.run === 'function') {
                await commandModule.run(message, client);
            } else {
                console.error(`El comando ${args} no tiene una función 'run'.`);
                message.reply("Comando no encontrado.");
            }
        } catch (error) {
            console.error(`Error al ejecutar el comando ${args}:`, error);
            message.reply("Hubo un error al ejecutar el comando.");
        }
    }

    if (message.content === '!encender') {
        // Encender el segundo bot
        exec('node index2.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al encender el segundo bot: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        message.channel.send('Segundo bot encendido.');
    }

    if (message.content === '!apagar') {
        // Apagar el segundo bot
        execSync('pkill -f node');
        message.channel.send('Segundo bot apagado.');
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
            const canvasWidth = 1000;
            const canvasHeight = 800;
            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext('2d');

            const background = await loadImage(path.join(__dirname, 'background.png'));
            ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

            const avatarSize = 200;
            const avatarX = (canvasWidth / 2) - (avatarSize / 2);
            const avatarY = (canvasHeight / 2) - (avatarSize / 2);

            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            const avatarURL = message.author.displayAvatarURL({ format: 'webp', size: 1024 });
            const response = await fetch(avatarURL);
            if (!response.ok) throw new Error('No se pudo descargar el avatar');

            const arrayBuffer = await response.arrayBuffer();
            const avatarBuffer = Buffer.from(arrayBuffer);
            const avatarPNGBuffer = await sharp(avatarBuffer).toFormat('png').toBuffer();
            const avatar = await loadImage(avatarPNGBuffer);
            ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

            ctx.restore();

            ctx.font = '100px Arial';
            ctx.fillStyle = '#D2D2CA';
            ctx.textAlign = 'center';

            const text = message.author.username;
            const textX = canvasWidth / 2;
            const textY = (canvasHeight / 2) + ((canvasHeight / 2) / 2);

            ctx.fillText(text, textX, textY);

            const attachment = canvas.toBuffer();
            const attachmentName = 'profile-image.png';

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setImage('attachment://' + attachmentName)

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

client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.G6Kk3N.Q_Ypo8lh4MU3TeJA7PY3gHTCJ_66Sm5CfEhxfU");
