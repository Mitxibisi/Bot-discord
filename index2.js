import { Client, GatewayIntentBits } from 'discord.js';
import pkg from 'distube';
const { DisTube } = pkg;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const distube = new DisTube(client);

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        const url = args[0];
        if (!url) {
            return message.channel.send('¡Por favor proporciona una URL!');
        }

        try {
            await distube.play(message.member.voice.channel, url, {
                textChannel: message.channel,
                member: message.member,
            });
            message.channel.send(`Reproduciendo: ${url}`);
        } catch (error) {
            console.error('Error al intentar reproducir:', error);
            message.channel.send('No se pudo reproducir el audio.');
        }
    }
});

client.login('MTI3OTM1MTk2NDA4NTUxODM0Ng.GarDXm.n4imUNx1-roPWzZ31pvZO4uyqDRDkS3W8XLfII');
