import { Events } from 'discord.js';
import { client, config } from '../index.js';

export default () => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        // Manejo de diferentes selectores
        if (interaction.customId === 'select-guildmemberchannel') {
          interaction.reply("1");
        }
      
        if (interaction.customId === 'select-listdeploymentchannel') {
            interaction.reply("2");
        }
      
        if (interaction.customId === 'select-ignoredchannelafk') {
            interaction.reply("3");
        }
      
        if (interaction.customId === 'select-voicemessageschannel') {
            interaction.reply("4");
        }
      
        if (interaction.customId === 'select-admrole') {
            interaction.reply("5");
        }
    });
}