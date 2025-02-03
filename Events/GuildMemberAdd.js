import { Events } from 'discord.js';
import { client } from '../index.js';
import { createUser} from '../Usersdb/database.js';
import { getGuild } from '../GuildsConfig/configs.js';

export default () => {
    client.on(Events.GuildMemberAdd, async (member) => {
        const Guild = getGuild(member.guild.id);
        const welcomeChannelId = Guild.GuildMemberAddRemoveId;
        let role = member.guild.roles.cache.get(Guild.NewmemberRoleId);
        await member.roles.add(role);
        
        try {
            const channel = await client.channels.fetch(welcomeChannelId);
            if (channel) {
                console.log("Intentando cargar el comando: profile");
                const commandPath = '../Templates/bienvenida.js';
                const commandModule = await import(commandPath);
                console.log(`Módulo cargado desde: ${commandPath}`);
                if (typeof commandModule.run === 'function') {
                    await commandModule.run(member, channel);
                    }
                }
                createUser(member.guild.id,member.id,member.username);
        }
            catch (error) {
                console.error(`Error en GuildMemberAdd: ${error.message}`);
            }   
    });
};