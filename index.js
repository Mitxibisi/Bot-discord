import { Client, Events, GatewayIntentBits, VoiceChannel } from 'discord.js';
import { addXp, createUser} from './usersdb/database.js';
import { setupDeploymentList } from './automatic/deploymentList.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const userVoiceTimes = new Map();

client.on(Events.ClientReady, async () => {
    console.log(`Conectado como ${client.user.tag}!`);

    const deploymentChannelId = '1328863426465894400';
    const guildId = '715955472502489129'
    await setupDeploymentList(client, deploymentChannelId, guildId);
});

client.on(Events.GuildMemberAdd, async (member) => {
    const welcomeChannelId = '732006205454811206';
    let role = member.guild.roles.cache.get('718115642691289164');
    await member.roles.add(role);
    
    try {
        const channel = await client.channels.fetch(welcomeChannelId);
        if (channel) {
            console.log("Intentando cargar el comando: profile");
            const commandPath = './templates/bienvenida.js';
            const commandModule = await import(commandPath);
            console.log(`Módulo cargado desde: ${commandPath}`);
            if (typeof commandModule.run === 'function') {
                await commandModule.run(member, channel);
                }
            }
            createUser(member.id,member.username);
    }
        catch (error) {
            console.error(`Error en GuildMemberAdd: ${error.message}`);
        }   
});

client.on(Events.GuildMemberRemove, async (member) => {
    const welcomeChannelId = '732006205454811206';
    try {
        const channel = await client.channels.fetch(welcomeChannelId);
        if (channel) {
            console.log("Intentando cargar el comando: profile");
            const commandPath = './templates/despedida.js';
            const commandModule = await import(commandPath);
            console.log(`Módulo cargado desde: ${commandPath}`);
            if (typeof commandModule.run === 'function') {
                await commandModule.run(member, channel);
                }
            }
        }
         catch (error) {
            console.error(`Error en GuildMemberAdd: ${error.message}`);
        }   
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    // Crear usuario si no existe
    createUser(message.author.id, message.author.username);
    
    if (message.content.startsWith('%')) {
        const args = message.content.slice(1).split(' ')[0];  // Extrae el comando
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
    }else {
        // Obtener el GuildMember del autor del mensaje
        const guildMember = await message.guild.members.fetch(message.author.id);
    
        // Agregar experiencia base
        await addXp(message.author.id, 50, guildMember, message, null);
    }    
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const userId = newState.id;
    const guildMember = newState.member || oldState.member; // Obtén el miembro del servidor (GuildMember)
    const ignoredChannelId = '731920860885286974'; // ID del canal a ignorar

       // Ignorar si el usuario es un bot
       if (guildMember.user.bot) {
        return;
    }

    // Ignorar si el usuario está silenciado en ambos estados
    if ((newState.selfMute || newState.serverMute) && (!oldState.channelId || oldState.selfMute || oldState.serverMute)) {
        return;
    }

    // Si el usuario entra en un canal de voz
    if (!oldState.channelId && newState.channelId) {
        // Ignorar el canal específico
        if (newState.channelId === ignoredChannelId) {
            return;
        }
        userVoiceTimes.set(userId, Date.now()); // Guardamos el tiempo de entrada
    }

    // Si el usuario sale de un canal de voz
    else if (oldState.channelId && !newState.channelId) {
        const enterTime = userVoiceTimes.get(userId);
        if (enterTime) {
            const elapsedTime = (Date.now() - enterTime) / 1000; // Tiempo en segundos

            // Ignorar el canal específico
            if (oldState.channelId === ignoredChannelId) {
                userVoiceTimes.delete(userId);
                return;
            }

            const channelId = '731926366131453982';
            try {
                const channel = await client.channels.fetch(channelId); // Espera a que se resuelva la promesa
                if (!channel.isTextBased()) {
                    console.error('El canal especificado no es de texto.');
                    return;
                }

                await addXp(userId, elapsedTime * 0.1, guildMember, null, channel);

                // Borra el tiempo de entrada del usuario
                userVoiceTimes.delete(userId);
            } catch (error) {
                console.error('Error al obtener el canal:', error);
            }
        }
    }
});

client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.G6Kk3N.Q_Ypo8lh4MU3TeJA7PY3gHTCJ_66Sm5CfEhxfU");