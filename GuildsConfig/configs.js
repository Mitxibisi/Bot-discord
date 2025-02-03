import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Conexión inicial a la base de datos
export const gdb = await open({
    filename: './Database/guilds.sqlite',
    driver: sqlite3.Database
});

// Crear tabla al iniciar (si no existe)
await gdb.exec(`
    CREATE TABLE IF NOT EXISTS guilds (
        guildId TEXT PRIMARY KEY,
        adminRoleId TEXT DEFAULT '',
        GuildMemberAddRemoveId TEXT DEFAULT '',
        NewmemberRoleId TEXT DEFAULT '',
        ListDeploymentChannel TEXT DEFAULT '',
        IgnoredChannelId TEXT DEFAULT '',
        VoiceMessagesChannel TEXT DEFAULT '',
        RolId1 TEXT DEFAULT '',
        RolId2 TEXT DEFAULT '',
        RolId3 TEXT DEFAULT '',
        RolId4 TEXT DEFAULT '',
        RolId5 TEXT DEFAULT '',
        RolId6 TEXT DEFAULT '',
        RolId7 TEXT DEFAULT '',
        RolId8 TEXT DEFAULT '',
        RolId9 TEXT DEFAULT '',
        RolId10 TEXT DEFAULT '',
        RolId11 TEXT DEFAULT '',
        RolId12 TEXT DEFAULT '',
        TemporalChannelsId TEXT DEFAULT '',
        SecretRolId1 TEXT DEFAULT '',
        OpcionesId TEXT DEFAULT ''
    );
`);

export async function createGuild(guildId) {
    try {
        const existingGuild = await gdb.get('SELECT * FROM guilds WHERE guildId = ?', [guildId]);
        if (!existingGuild) {
            await gdb.run('INSERT INTO guilds (guildId) VALUES (?)', [guildId]);
            console.log(`Creado servidor con ID: ${guildId}`);
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