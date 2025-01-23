import { Client, Events, GatewayIntentBits, VoiceChannel } from 'discord.js';
import { addXp, createUser} from './usersdb/database.js';
import { setupDeploymentList } from './automatic/deploymentList.js';
import { readFile } from 'fs/promises';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

//Acceso a los datos de configuracion
const config = JSON.parse(await readFile(new URL('./config.json', import.meta.url)));

// Un mapa para rastrear la actividad de entrada y salida de los usuarios de los canalez de voz
const userVoiceTimes = new Map();

// Un mapa para rastrear los últimos mensajes de cada usuario
const userCooldowns = new Map();

client.on(Events.ClientReady, async () => {
    console.log(`Conectado como ${client.user.tag}!`);

    Deploy(config);
});

client.on(Events.GuildMemberAdd, async (member) => {
    const welcomeChannelId = config.GuildMemberAdd/RemoveId;
    let role = member.guild.roles.cache.get(config.NewmemberRoleId);
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
    const welcomeChannelId = config.GuildMemberAdd/RemoveId;
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
    
    if (message.content.startsWith('%')) {
        const args = message.content.slice(1).split(' ')[0];  // Extrae el comando
        try {
            console.log(`Intentando cargar el comando: ${args}`);
            // Intenta cargar el módulo del comando
            const commandPath = `./commands/${args}.js`;
            const commandModule = await import(commandPath);
            console.log(`Módulo cargado desde: ${commandPath}`);
            if (typeof commandModule.run === 'function') {
                await commandModule.run(message, client, config);
            } else {
                console.error(`El comando ${args} no tiene una función 'run'.`);
                message.reply("Comando no encontrado.");
            }
        } catch (error) {
            console.error(`Error al ejecutar el comando ${args}:`, error);
            message.reply("Hubo un error al ejecutar el comando.");
        }
    }else {
        const userId = message.author.id;
        const now = Date.now();
        const cooldownTime = 2000; // Tiempo en milisegundos (5 segundos)
    
        // Comprobar si el usuario está en cooldown
        if (userCooldowns.has(userId)) {
            const lastMessageTime = userCooldowns.get(userId);
            const timeDifference = now - lastMessageTime;
    
            if (timeDifference < cooldownTime) {
                // Está en cooldown, no hacer nada
                return;
            }
        }
    
        // Si no está en cooldown, otorgar experiencia
        const xpAmount = 50; // Cantidad base de experiencia
        const guildMember = await message.guild.members.fetch(userId);
    
        await addXp(userId, xpAmount, guildMember, message, null, config);
    
        // Actualizar el tiempo del último mensaje
        userCooldowns.set(userId, now);
    }    
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const userId = newState.id;
    const guildMember = newState.member || oldState.member; // Obtén el miembro del servidor (GuildMember)
    const ignoredChannelId = config.IgnoredChannelId; // ID del canal a ignorar

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

            const channelId = config.VoiceMessagesChannel;
            try {
                const channel = await client.channels.fetch(channelId); // Espera a que se resuelva la promesa
                if (!channel.isTextBased()) {
                    console.error('El canal especificado no es de texto.');
                    return;
                }

                await addXp(userId, elapsedTime * 0.1, guildMember, null, channel, config);

                // Borra el tiempo de entrada del usuario
                userVoiceTimes.delete(userId);
            } catch (error) {
                console.error('Error al obtener el canal:', error);
            }
        }
    }
});

client.login(config.token);

export async function Deploy(config) {
    const deploymentChannelId = config.ListDeploymentChannel;
    const guildId = config.GuildId;
    await setupDeploymentList(client, deploymentChannelId, guildId);
}