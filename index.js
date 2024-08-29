const { Client, Events } = require('discord.js');
const { token } = require('./client');

// Crear nuevo cliente de Discord
const client = new Client({
    intents: 3276799
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
            // Obtener los últimos 100 mensajes del canal
            messages = await channel.messages.fetch({ limit: 100 });
            
            // Eliminar cada mensaje
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
client.login(token);
