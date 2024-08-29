const { Client, Events } = require('discord.js');

// Crear nuevo cliente de Discord
const client = new Client({
    intents: 3276799
});

// Función para limpiar el canal
async function clearChannel(channelId) {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) return;

    let messages;
    do {
        messages = await channel.messages.fetch({ limit: 100 });
        messages.forEach(msg => msg.delete().catch(console.error));
    } while (messages.size > 0);
}

// Manejo de eventos
client.on(Events.ClientReady, async () => {
    console.log(`Conectado como ${client.user.username}!`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    // Comando para limpiar el canal
    if (message.content.startsWith('¿clear')) {
        await clearChannel(message.channel.id);
        return message.channel.send('Channel cleared!').then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    }

    // Comando para manejar otros comandos
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

//Conectar cliente
client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.GD4Nb6.rAx_FPlZPv6hipVLW-IbxSqoV11Srg_O-opMWc");
