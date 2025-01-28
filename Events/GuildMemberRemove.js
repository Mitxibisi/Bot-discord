import { Events } from 'discord.js';
import { client, config } from '../index.js';

export default () => {
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
};