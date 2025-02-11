import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Conexión inicial a la base de datos
export const tdb = await open({
    filename: './Database/database.sqlite',
    driver: sqlite3.Database
});

// Crear tabla al iniciar (si no existe)
await tdb.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
            ticketName TEXT PRIMARY KEY,
            ticketId TEXT,
            userId TEXT,
            username TEXT,
            guildId TEXT,
            createdAt TEXT,
            status TEXT,
            closedAt TEXT
    )
`);

export async function insertTicket(ticketName, ticketId, userId, username, guildId) {
    await tdb.run(`
        INSERT INTO tickets (ticketName, ticketId, userId, username, guildId, createdAt, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [ticketName, ticketId, userId, username, guildId, new Date().toISOString(), 'open']);
}

export async function updateTicketStatus(ticketId, status) {
    await tdb.run(`
        UPDATE tickets
        SET status = ?, closedAt = ?
        WHERE ticketId = ?
    `, [status, new Date().toISOString(), ticketId]);
}

export async function getTicketsByGuild(guildId) {
    const rows = await tdb.all('SELECT * FROM tickets WHERE guildId = ?', [guildId]);
    return rows;
}

export async function tieneTodosLosTicketsCerrados(userId, guildId) {
    const ticketAbierto = await tdb.get(
        'SELECT * FROM tickets WHERE userId = ? AND guildId = ? AND status = "open" LIMIT 1',
        [userId, guildId]
    );
    return !ticketAbierto; // Devuelve true si no hay tickets abiertos, false si hay al menos uno abierto
}

export async function ticketsDelete(guildId) {
    try {
            await tdb.run(`DELETE FROM tickets WHERE guildId = ?`, [guildId]);
    } catch (error) {
        console.error('Error en DeleteGuild:', error.message);
    }
}