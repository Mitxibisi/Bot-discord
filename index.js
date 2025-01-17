import { Client, Events, GatewayIntentBits, VoiceChannel } from 'discord.js';
import { addXp, createUser} from './usersdb/database.js';
import { setupDeploymentList } from './automatic/deploymentList.js';
import { token } from './config.json';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

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
        await addXp(message.author.id, 50, guildMember, message);
    }    
});

client.login(token);