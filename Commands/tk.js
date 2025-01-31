import { getTicketsByGuild } from "../Tickets/tickets.js";

export async function run(message) {
    const tickets = await getTicketsByGuild(message.guild.id);

    if (tickets.length === 0) {
        return message.reply('No hay tickets registrados en esta guild.');
    }

    const ticketList = tickets.map(ticket => 
        `🎟️ **ID:** ${ticket.ticketName}\n👤 **Usuario:** ${ticket.username}\n📅 **Creado:** ${ticket.createdAt}\n📌 **Cerrado:** ${ticket.closedAt}\n📌 **Estado:** ${ticket.status}\n`
    ).join('\n──────────────────\n');

    message.reply(`📋 **Tickets en esta guild:**\n\n${ticketList}`);
}