import path from 'path';
import { Client, CommandInteraction, Events, GatewayIntentBits } from 'discord.js';
import { fileURLToPath } from 'url';
import { exec, execSync } from 'child_process';
import { compileFunction } from 'vm';
import { db, getUser, addXp, createUser} from './database.js';

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
    try {
        const channel = await client.channels.fetch(welcomeChannelId);
        if (channel) {
            console.log("Intentando cargar el comando: profile");
            const commandPath = './templates/profile.js';
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

client.on(Events.GuildMemberRemove, async (member) => {
    const welcomeChannelId = '732006205454811206';
    const channel = await client.channels.fetch(welcomeChannelId);

    if (channel) {
        channel.send(`**<@${member.user.id}> Y SE MARCHOO**`);
    }
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    createUser(message.author.id, message.author.username);
    addXp(message.author.id, 20)

    if (message.content.startsWith('%')) {
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

    if (message.content === '!perfil') {
            try {
            const user = await getUser(message.author.id); // Obtén los datos del usuario de la base de datos
            console.log(user); // Para depuración
            console.log("Intentando cargar el comando: embed");
            const commandPath = './templates/embed.js';
            const commandModule = await import(commandPath);
            console.log(`Módulo cargado desde: ${commandPath}`);

                if (typeof commandModule.run === 'function') {
                    await commandModule.run(message, user); // Pasa `user` al comando
                 }

            } catch (error) {
               console.error(`Error en perfil: ${error.message}`);
                }
    }
});
client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.G6Kk3N.Q_Ypo8lh4MU3TeJA7PY3gHTCJ_66Sm5CfEhxfU");