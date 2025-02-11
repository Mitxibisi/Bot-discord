import { Events } from 'discord.js';
import { client } from '../index.js';
import { getGuild } from '../GuildsConfig/configs.js';
import { userDelete } from '../Usersdb/database.js';

export default () => {
    client.on(Events.GuildMemberRemove, async (member) => {
        try{
            if(member.user.id !== client.user.id){

            const Guild = await getGuild(member.guild.id);
            const welcomeChannelId = Guild.GuildMemberAddRemoveId;
            if (!member.user.bot){
                await userDelete(member.user.id, member.guild.id);
            }

            if (!welcomeChannelId){
                console.log('Prueba');
                return;
            }else{
                const channel = await client.channels.fetch(welcomeChannelId);
                if (channel) {
                    const commandPath = '../Templates/despedida.js';
                    const commandModule = await import(commandPath);
                    console.log(`Módulo cargado desde: ${commandPath}`);
                    if (typeof commandModule.run === 'function') {
                        await commandModule.run(member, channel);
                    }
                }
            }
        }
        }catch (error) {
                    console.error(`Error en GuildMemberAdd: ${error.message}`);
        }
    });
};