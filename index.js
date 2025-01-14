import path from 'path';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { fileURLToPath } from 'url';
import { getUser, addXp, createUser, reset} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.on(Events.ClientReady, () => {
    console.log(`Conectado como ${client.user.tag}!`);
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

    // Obtener el GuildMember asociado al autor del mensaje
    const guild = client.guilds.cache.get('715955472502489129');
    if (!guild) {
        console.error("No se encontró la guild con ID 715955472502489129.");
        return;
    }

    const guildMember = await guild.members.fetch(message.author.id).catch((error) => {
        console.error(`Error al obtener el GuildMember: ${error.message}`);
        return null;
    });

    if (!guildMember) {
        console.error(`El GuildMember para el usuario ${message.author.id} no pudo ser obtenido.`);
        return;
    }

    if (message.content.startsWith('!addxp')) {
        // Obtener el GuildMember del autor del mensaje
        const guildMember = await message.guild.members.fetch(message.author.id);
    
        // ID del rol requerido
        const requiredRoleId = '731870690206154785'; // Reemplaza con el ID del rol necesario
    
        // Comprobar si el autor tiene el rol requerido
        if (guildMember.roles.cache.has(requiredRoleId)) {
            // Dividir el mensaje en argumentos
            const args = message.content.split(' ');
            const xpAmount = parseInt(args[1], 10); // Toma el segundo argumento como XP
            const targetUserMention = args[2]; // Mención del usuario objetivo
    
            // Validar el argumento de XP
            if (isNaN(xpAmount)) {
                return message.reply('Por favor, proporciona una cantidad válida de XP.');
            }
    
            // Obtener usuario objetivo
            let targetMember;
            if (targetUserMention) {
                // Validar que se ha mencionado a un usuario
                const match = targetUserMention.match(/^<@!?(\d+)>$/);
                if (!match) {
                    return message.reply('Por favor, menciona un usuario válido para asignar XP.');
                }
    
                const targetUserId = match[1];
                targetMember = await message.guild.members.fetch(targetUserId).catch(() => null);
    
                if (!targetMember) {
                    return message.reply('No se ha encontrado al usuario mencionado en este servidor.');
                }
            } else {
                // Si no se menciona, se asigna XP al autor
                targetMember = guildMember;
            }
    
            // Añadir XP
            await addXp(targetMember.id, xpAmount, targetMember, message);
            return message.reply(`Se han añadido ${xpAmount} XP a ${targetMember.user.displayName}.`);
        } else {
            // El usuario no tiene el rol requerido
            return message.reply('No tienes los permisos necesarios para ejecutar este comando.');
        }
    } else {
        // Obtener el GuildMember del autor del mensaje
        const guildMember = await message.guild.members.fetch(message.author.id);
    
        // Agregar experiencia base
        await addXp(message.author.id, 20, guildMember, message);
    }    
    
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
    }

    if (message.content === '!perfil') {
        try {
            const user = await getUser(message.author.id); // Obtén los datos del usuario de la base de datos
            console.log(user); // Para depuración
            console.log("Intentando cargar el comando: embed");
            const commandPath = './templates/perfil.js';
            const commandModule = await import(commandPath);
            console.log(`Módulo cargado desde: ${commandPath}`);

                if (typeof commandModule.run === 'function') {
                    await commandModule.run(message, user); // Pasa `user` al comando
                 }

        } catch (error) {
               console.error(`Error en perfil: ${error.message}`);
               message.reply('Error al generar el perfil');
            }
    }

    if (message.content === '!reset'){
        await reset(message.author.id);
    }
});

client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.G6Kk3N.Q_Ypo8lh4MU3TeJA7PY3gHTCJ_66Sm5CfEhxfU");