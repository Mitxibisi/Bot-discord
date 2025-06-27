// Importa los eventos predefinidos de Discord.js
import { Events } from 'discord.js';
// Importa la instancia del cliente desde el archivo principal
import { client } from '../index.js';
// Importa la función para configurar menús de opciones automáticos
import { OptionsMenu } from '../Automatic/OpcionesMenu.js';
// Importa funciones para manejar tickets (ver y eliminar)
import { ticketView, ticketDelete } from '../Commands/tickets.js';
// Importa la instancia de la base de datos de configuración de servidores
import { gdb } from '../GuildsConfig/configs.js';

// Función por defecto que registra el evento para manejar todas las interacciones
export default () => {
    // Evento que se ejecuta cuando los usuarios interactúan con botones, menús, comandos slash, etc.
    client.on(Events.InteractionCreate, async (interaction) => {
        // Filtro: ignora interacciones específicas que se manejan en otros lugares
        // btn_ = botones de juegos, choice_ = opciones de juegos, game- = interacciones de juegos
        if (interaction.customId.startsWith('btn_') || interaction.customId.startsWith('choice_') || interaction.customId.startsWith('game-')) {
            return; // No procesa estas interacciones aquí
        }
        
        // Solo procesa menús de selección de strings y botones
        if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;

        try {
            // Defer (diferir) la respuesta para tener más tiempo de procesamiento
            // flags: 64 hace que la respuesta sea ephemeral (solo visible para el usuario)
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ flags: 64 });
            }

            // Mapeo de IDs de menús de selección con sus campos correspondientes en la base de datos
            // Cada clave es el customId del menú, cada valor es el campo de la BD que se actualizará
            const menuActions = {
                'select-guildmemberchannel': 'GuildMemberAddRemoveId',      // Canal de bienvenida/despedida
                'select-listdeploymentchannel': 'ListDeploymentChannel',    // Canal para lista de comandos
                'select-ignoredchannelafk': 'IgnoredChannelId',             // Canal ignorado para AFK
                'select-voicemessageschannel': 'VoiceMessagesChannel',      // Canal para mensajes de voz
                'select-admrole': 'adminRoleId',                            // Rol de administrador
                'select-temporalchannelscategory': 'TemporalChannelsId',    // Categoría para canales temporales
                'select-newmemberrole': 'NewmemberRoleId',                  // Rol para nuevos miembros
                'select-nvrol1': 'RolId1',                                  // Roles de nivel 1-13
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
                'select-secretrol': 'SecretRolId1'                          // Rol secreto
            };

            // Busca si el customId de la interacción corresponde a algún menú de configuración
            const configField = menuActions[interaction.customId];
            
            // Si es un menú de selección y está en la lista de configuraciones
            if (interaction.isStringSelectMenu() && configField) {
                // Actualiza la configuración del servidor en la base de datos
                // interaction.values[0] es el valor seleccionado por el usuario
                await gdb.run(`
                    UPDATE guilds
                    SET ${configField} = ?
                    WHERE guildId = ?
                `, [interaction.values[0], interaction.guild.id]);

                // Confirma al usuario que la configuración se actualizó
                await interaction.editReply({ content: `✅ Configuración actualizada: ${configField}` });
            } 

            // Manejo de interacciones con botones
            if (interaction.isButton()) {
                // Botón para reiniciar el menú de opciones
                if (interaction.customId === 'restart-button') {
                    await interaction.editReply({ content: '🔄 Reiniciando opciones...' });
                    // Regenera el menú de opciones para el servidor
                    await OptionsMenu(interaction.guild);
                }

                // Botón para crear un nuevo ticket
                if (interaction.customId === 'new-ticket') {
                    await ticketView(interaction);
                }

                // Botón para cerrar/eliminar un ticket
                if (interaction.customId === 'close-ticket') {
                    await ticketDelete(interaction);
                }
            }

            // Auto-eliminación de respuestas después de 5 segundos
            // Solo elimina si se respondió correctamente y no es el botón de cerrar ticket
            if ((interaction.replied || interaction.deferred)&& interaction.customId !== 'close-ticket') {
                setTimeout(async () => {
                    try {
                        await interaction.deleteReply();
                    } catch (error) {
                        console.log("Error al eliminar la respuesta de la interacción:", error);
                    }
                }, 5000); // 5000ms = 5 segundos
            }

        } catch (error) {
            // Manejo de errores: captura cualquier error durante el procesamiento
            console.error('Error durante la interacción:', error);
            // Si no se ha respondido aún, envía un mensaje de error
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: '❌ Ocurrió un error inesperado.', ephemeral: true });
            }
        }
    });
};