import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Conexión inicial a la base de datos
export const gdb = await open({
    filename: './Database/database.sqlite',
    driver: sqlite3.Database
});

// Crear tabla al iniciar (si no existe)
await gdb.exec(`
    CREATE TABLE IF NOT EXISTS guilds (
        guildId TEXT PRIMARY KEY,
        adminRoleId TEXT DEFAULT NULL,
        GuildMemberAddRemoveId TEXT DEFAULT NULL,
        NewmemberRoleId TEXT DEFAULT NULL,
        ListDeploymentChannel TEXT DEFAULT NULL,
        IgnoredChannelId TEXT DEFAULT NULL,
        VoiceMessagesChannel TEXT DEFAULT NULL,
        RolId1 TEXT DEFAULT NULL,
        RolId2 TEXT DEFAULT NULL,
        RolId3 TEXT DEFAULT NULL,
        RolId4 TEXT DEFAULT NULL,
        RolId5 TEXT DEFAULT NULL,
        RolId6 TEXT DEFAULT NULL,
        RolId7 TEXT DEFAULT NULL,
        RolId8 TEXT DEFAULT NULL,
        RolId9 TEXT DEFAULT NULL,
        RolId10 TEXT DEFAULT NULL,
        RolId11 TEXT DEFAULT NULL,
        RolId12 TEXT DEFAULT NULL,
        RolId13 TEXT DEFAULT NULL,
        TemporalChannelsId TEXT DEFAULT NULL,
        SecretRolId1 TEXT DEFAULT NULL
    );
`);

export async function createGuild(guildId) {
    try {
        const existingGuild = await gdb.get('SELECT * FROM guilds WHERE guildId = ?', [guildId]);
        if (!existingGuild) {
            await gdb.run(`
            INSERT INTO guilds (
            guildId, adminRoleId, GuildMemberAddRemoveId, NewmemberRoleId,
            ListDeploymentChannel, IgnoredChannelId, VoiceMessagesChannel,
            RolId1, RolId2, RolId3, RolId4, RolId5, RolId6, RolId7, RolId8, RolId9,
            RolId10, RolId11, RolId12, RolId13, TemporalChannelsId, SecretRolId1
            ) VALUES (
            ?, NULL, NULL, NULL, NULL, NULL, NULL,
            NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
            NULL, NULL, NULL, NULL, NULL, NULL
            )
            `, [guildId]);
        }
    } catch (error) {
        console.error('Error en createGuild:', error.message);
    }
}

// Función para obtener la configuración del servidor
export async function getGuild(guildId) {
    try {
        const guild = await gdb.get('SELECT * FROM guilds WHERE guildId = ?', [guildId]);
        if (guild) {
            return guild;
        } else {
            console.log(`Servidor con ID ${guildId} no encontrado.`);
            return null;
        }
    } catch (error) {
        console.error('Error en getGuild:', error.message);
        return null;
    }
}

export async function guildDelete(guildId) {
    try {
            await gdb.run(`DELETE FROM guilds WHERE guildId = ?`, [guildId]);
    } catch (error) {
        console.error('Error en DeleteGuild:', error.message);
    }
}