import { Events } from 'discord.js';
import { client, config } from '../index.js';
import { updateConfig } from '../index.js';
import { OptionsMenu } from '../Automatic/OpcionesMenu.js';

let variables = {
    token: config.token,
    GuildId: config.GuildId,
    adminRoleId: config.adminRoleId,
    GuildMemberAddRemoveId: config.GuildMemberAddRemoveId,
    NewmemberRoleId: config.NewmemberRoleId,
    ListDeploymentChannel: config.ListDeploymentChannel,
    IgnoredChannelId: config.IgnoredChannelId,
    VoiceMessagesChannel: config.VoiceMessagesChannel,
    RolId1: config.RolId1,
    RolId2: config.RolId2,
    RolId3: config.RolId3,
    RolId4: config.RolId4,
    RolId5: config.RolId5,
    RolId6: config.RolId6,
    RolId7: config.RolId7,
    RolId8: config.RolId8,
    RolId9: config.RolId9,
    RolId10: config.RolId10,
    RolId11: config.RolId11,
    RolId12: config.RolId12,
    TemporalChannelsId: config.TemporalChannelsId,
    SecretRolId1: config.SecretRolId1,
    OpcionesId: config.OpcionesId
}

export default () => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        // Manejo de diferentes selectores
        if (interaction.customId === 'select-optionschannel') {
            variables.OpcionesId = interaction.values[0];
        }

        if (interaction.customId === 'select-admrole') {
            console.log(interaction.id);
            variables.adminRoleId = interaction.values[0];
        }

        await updateConfig(variables);
        await OptionsMenu();
    });
}