import { Client, Events, GatewayIntentBits } from 'discord.js';
import { addXp, createUser} from './usersdb/database.js';
import { setupDeploymentList } from './automatic/deploymentList.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
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
        await addXp(message.author.id, 20, guildMember, message);
    }    
});

client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.G6Kk3N.Q_Ypo8lh4MU3TeJA7PY3gHTCJ_66Sm5CfEhxfU");