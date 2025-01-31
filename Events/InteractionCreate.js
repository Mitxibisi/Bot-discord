import { Events } from 'discord.js';
import { client, config } from '../index.js';
import { updateConfig } from '../index.js';
import { OptionsMenu } from '../Automatic/OpcionesMenu.js';
import { ticketView, ticketDelete } from '../Commands/tickets.js';


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
        if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;

        if (interaction.isStringSelectMenu()) {
            await interaction.deferReply({ ephemeral: true }); // Evita la interacción fallida

            const menuActions = {
                'select-guildmemberchannel': 'GuildMemberAddRemoveId',
                'select-listdeploymentchannel': 'ListDeploymentChannel',
                'select-ignoredchannelafk': 'IgnoredChannelId',
                'select-voicemessageschannel': 'VoiceMessagesChannel',
                'select-admrole': 'adminRoleId',
                'select-temporalchannelscategory': 'TemporalChannelsId',
                'select-newmemberrole': 'NewmemberRoleId',
                'select-nvrol1': 'RolId1',
                'select-nvrol2': 'RolId2',
                'select-nvrol3': 'RolId3',
                'select-nvrol4': 'RolId4',
                'select-nvrol5': 'RolId5',
                'select-nvrol6': 'RolId6',
                'select-nvrol7': 'RolId7',
                'select-nvrol8': 'RolId8',
                'select-nvrol9': 'RolId9',
                'select-nvrol10': 'RolId10',
                'select-nvrol11': 'RolId11',
                'select-nvrol12': 'RolId12',
                'select-secretrol': 'SecretRolId1'
            };

            if (menuActions[interaction.customId]) {
                variables[menuActions[interaction.customId]] = interaction.values[0];
                await updateConfig(variables);
                await interaction.editReply({ content: `✅ Configuración actualizada: ${menuActions[interaction.customId]}` });
            }
        }

        if (interaction.isButton() && interaction.customId === 'restart-button') {
            await interaction.deferReply({ ephemeral: true }); // Evita la interacción fallida
            await interaction.editReply({ content: '🔄 Reiniciando opciones...' });
            await OptionsMenu();
        }

        if (interaction.isButton() && interaction.customId === 'new-ticket') {
            ticketView(interaction);
        }

        if (interaction.isButton() && interaction.customId === 'close-ticket') {
            await ticketDelete(interaction);
        }

        // Eliminar la respuesta de la interacción solo si fue respondida correctamente
        if (interaction.replied || interaction.deferred) {
            setTimeout(async () => {
                try {
                    await interaction.deleteReply(); // Eliminar la respuesta de la interacción
                } catch (error) {
                    console.log("Error al eliminar la respuesta de la interacción:", error);
                }
            }, 5000); // 5000 ms = 5 segundos
        }
    });
};