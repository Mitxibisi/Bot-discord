import { Events } from 'discord.js';
import { client } from '../index.js';
import { createUser} from '../Usersdb/database.js';
import { getGuild } from '../GuildsConfig/configs.js';

export default () => {
    client.on(Events.GuildMemberAdd, async (member) => {
        
        const Guild = await getGuild(member.guild.id);
        const welcomeChannelId = Guild.GuildMemberAddRemoveId;
        const role = member.guild.roles.cache.get(Guild.NewmemberRoleId);
        

            


        if(role){
            await member.roles.add(role);
        }
        
        if (welcomeChannelId){
            try {
                const channel = await client.channels.fetch(welcomeChannelId);
                if (channel) {
                    const commandPath = '../Templates/bienvenida.js';
                    const commandModule = await import(commandPath);
                    console.log(`Módulo cargado desde: ${commandPath}`);
                    if (typeof commandModule.run === 'function') {
                        await commandModule.run(member, channel);
                        }
                    }
                    await createUser(member.guild.id,member.id,member.user.username);
            }catch (error) {
                    console.error(`Error en GuildMemberAdd: ${error.message}`);
            }   
        }
    });
};