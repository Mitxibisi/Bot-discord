import { Events } from 'discord.js';
import { client } from '../index.js';
import { OptionsMenu } from '../Automatic/OpcionesMenu.js';
import { ticketView, ticketDelete } from '../Commands/tickets.js';
import { gdb } from '../GuildsConfig/configs.js';

export default () => {
    client.on(Events.InteractionCreate, async (interaction) => {
if (interaction.customId.startsWith('btn_') || interaction.customId.startsWith('choice_') || interaction.customId.startsWith('game-')) {
    return;
}
        if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;

        try {
            // Defer solo si es necesario
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ flags: 64 });
            }

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
                'select-nvrol13': 'RolId13',
                'select-secretrol': 'SecretRolId1'
            };

            const configField = menuActions[interaction.customId];
            if (interaction.isStringSelectMenu() && configField) {
                await gdb.run(`
                    UPDATE guilds
                    SET ${configField} = ?
                    WHERE guildId = ?
                `, [interaction.values[0], interaction.guild.id]);

                await interaction.editReply({ content: `✅ Configuración actualizada: ${configField}` });
            } 

            if (interaction.isButton()) {
                if (interaction.customId === 'restart-button') {
                    await interaction.editReply({ content: '🔄 Reiniciando opciones...' });
                    await OptionsMenu(interaction.guild);
                }

                if (interaction.customId === 'new-ticket') {
                    await ticketView(interaction);
                }

                if (interaction.customId === 'close-ticket') {
                    await ticketDelete(interaction);
                }
            }

            // Solo eliminar si se respondió o diferió correctamente
            if ((interaction.replied || interaction.deferred)&& interaction.customId !== 'close-ticket') {
                setTimeout(async () => {
                    try {
                        await interaction.deleteReply();
                    } catch (error) {
                        console.log("Error al eliminar la respuesta de la interacción:", error);
                    }
                }, 5000);
            }

        } catch (error) {
            console.error('Error durante la interacción:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: '❌ Ocurrió un error inesperado.', ephemeral: true });
            }
        }
    });
};