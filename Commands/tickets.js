import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } from 'discord.js';
import { updateTicketStatus, insertTicket, tieneTodosLosTicketsCerrados} from '../Tickets/tickets.js';

function generateCode() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789-';
    let code = '';
    for (let i = 0; i < 12; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    return code;
}

export async function run(message) {
    // Crear un botón interactivo
    const lastButton = new ButtonBuilder()
        .setCustomId('new-ticket')
        .setLabel('Abrir Ticket') // Texto del botón
        .setStyle(ButtonStyle.Success); // Estilo verde

    const buttonRow = new ActionRowBuilder().addComponents(lastButton);

    // Enviar el botón como mensaje
    message.reply({
        content: `✅ **Haz clic en el botón para crear un nuevo ticket**`,
        components: [buttonRow],
    }).catch(error => console.log("Error en el botón de confirmación:", error));   
}

export async function ticketView(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;

    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ flags: 64 });
    }

    const TicketsAbiertos = await tieneTodosLosTicketsCerrados(user.id, guild.id);

    if (!TicketsAbiertos) {
        await interaction.reply({
            content: '❌ Ya tienes un ticket abierto.',
            flags: 64, // Ephemeral en Discord.js v14
        });
        return;
    }

    let categoria = guild.channels.cache.find(c => c.name === "Tickets" && c.type === ChannelType.GuildCategory);
    if (!categoria) {
        categoria = await guild.channels.create({
            name: "Tickets",
            type: ChannelType.GuildCategory
        });
    }

    const Name = generateCode()

    const canal = await guild.channels.create({
        name: `ticket-${Name}`,
        type: ChannelType.GuildText,
        parent: categoria.id,
        permissionOverwrites: [
            {
                id: guild.id, // Todos los usuarios
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: user.id, // Usuario del ticket
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
            }
        ]
    });

    // Insertar el ticket en la base de datos con guildId
    await insertTicket(Name, canal.id, user.id, user.username, guild.id);

    await interaction.editReply({ content: `🎟 **Ticket creado:** ${canal}` });
    const CloseButton = new ButtonBuilder()
        .setCustomId('close-ticket')
        .setLabel('Cerrar Ticket')
        .setStyle(ButtonStyle.Danger);
    const buttonRow = new ActionRowBuilder().addComponents(CloseButton);

    await canal.send({
        content: `${user}, aquí está tu ticket. Un moderador te atenderá pronto.`,
        components: [buttonRow]
    });
}

// Función para eliminar el ticket
export async function ticketDelete(interaction) {
    const user = interaction.user;
    const canal = interaction.channel;
    const guild = interaction.guild;

    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ flags: 64 });
    }









    // Actualizar el ticket en la base de datos
    await updateTicketStatus(canal.id, 'closed');

    await interaction.editReply({
        content: `✅ **Ticket cerrado y canal eliminadose.**`
    });

    // Eliminar el canal
    await canal.delete();
}