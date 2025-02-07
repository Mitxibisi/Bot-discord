import { Events } from 'discord.js';
import { client } from '../index.js';
import { createUser} from '../Usersdb/database.js';
import { getGuild } from '../GuildsConfig/configs.js';

export default () => {
    client.on(Events.GuildMemberAdd, async (member) => {
    try{  
        const Guild = await getGuild(member.guild.id);
        const welcomeChannelId = Guild.GuildMemberAddRemoveId;
        const role = member.guild.roles.cache.get(Guild.NewmemberRoleId);
        if(!member.user.bot){
            await createUser(member.guild.id,member.id,member.user.username);       
            if(role){
                await member.roles.add(role);
            }
        }
        
        if (welcomeChannelId){
            const channel = await client.channels.fetch(welcomeChannelId);
            if (channel) {
                const commandPath = '../Templates/bienvenida.js';
                const commandModule = await import(commandPath);
                console.log(`Módulo cargado desde: ${commandPath}`);
                if (typeof commandModule.run === 'function') {
                    await commandModule.run(member, channel);
                }
            }
        }
    }catch (error) {
            console.error(`Error en GuildMemberAdd: ${error.message}`);
        }
    });
};