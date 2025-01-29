import { Events } from 'discord.js';
import { client, config } from '../index.js';
import { createUser} from '../Usersdb/database.js';

export default () => {
    client.on(Events.GuildMemberAdd, async (member) => {
        const welcomeChannelId = config.GuildMemberAddRemoveId;
        let role = member.guild.roles.cache.get(config.NewmemberRoleId);
        await member.roles.add(role);
        
        try {
            const channel = await client.channels.fetch(welcomeChannelId);
            if (channel) {
                console.log("Intentando cargar el comando: profile");
                const commandPath = './Templates/bienvenida.js';
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
};