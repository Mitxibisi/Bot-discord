//Archivo Index.js
const { Client, Events } = require('discord.js');

//Crear nuevo cliente de discord
const client = new Client({
    intents: 3276799
});

//Primer Evento
client.on(Events.ClientReady, async () => {
    console.log(`Conectado como ${client.user.username}!`);
});
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('-')) return;

    const args = message.content.slice(1).split(' ')[0]

    try {
        const command = require(`./commands/${args}`);
        command.run(message);
    } catch (error) {
        console.log(`Error general al usar el comando ${args}`, error.message)
        return message.reply("Sin comando seleccionado")
    }
})

client.on(Events.GuildMemberAdd, async (member) => {
    const welcomeChannelId = '732006205454811206';
    const channel = await client.channels.fetch(welcomeChannelId);

    channel.send(`**<@${member.user.id}> bienvenido a la comunidad**`);
})

client.on(Events.GuildMemberRemove, async (member) => {
    const welcomeChannelId = '732006205454811206';
    const channel = await client.channels.fetch(welcomeChannelId);

    if(args === "hola") message.reply("Hola")
})

//Conectar cliente
client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.GD4Nb6.rAx_FPlZPv6hipVLW-IbxSqoV11Srg_O-opMWc");