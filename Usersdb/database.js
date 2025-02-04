import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { levelupmessage } from '../Templates/levelup.js';
import { getGuild } from '../GuildsConfig/configs.js';

// Conexión inicial a la base de datos
export const db = await open({
    filename: './Database/database.sqlite',
    driver: sqlite3.Database
});

// Crear tabla al iniciar (si no existe)
await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        guild TEXT NOT NULL,
        id TEXT NOT NULL,
        username TEXT,
        level INTEGER DEFAULT 0,
        xp INTEGER DEFAULT 0,
        levelupxp INTEGER DEFAULT 50,
        rolid INTEGER DEFAULT 0
    )
`);

export async function createUser(guildId, userId, username) {
    try {
        const existingUser = await db.get('SELECT * FROM users WHERE id = ? AND guild = ?', [userId, guildId]);
        if (!existingUser) {
            await db.run(
                'INSERT INTO users (guild, id, username, level, xp, levelupxp, rolid) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [guildId, userId, username, 0, 0, 50, 0]
            );
            console.log(`En el servidor con ID: ${guildId} se ha creado el perfil del usuario: ${username}`);
        } else {
            return;
        }
    } catch (error) {
        console.error('Error en createUser:', error.message);
    }
}

// Funciones para manejar la base de datos
export async function getUser(guildId, userId, username) {
    try {
        const user = await db.get('SELECT * FROM users WHERE id = ? AND guild = ?', [userId, guildId]);
        if (user) {
            return user;
        } else {
            createUser(guildId,userId,username);
            return null; // Devuelve null explícitamente si no existe
        }
    } catch (error) {
        console.error('Error en getUser:', error.message);
        return null; // En caso de error, también devuelve null
    }
}

export async function addXp(guildId, userId, xpAmount, guildMember, message, channel, Guild) {
    const user = await getUser(guildId, userId, guildMember.user.username);

    if (!user) {
        console.error(`El usuario con ID ${userId} no existe.`);
        return null;
    }

    let newXp = user.xp + xpAmount;
    let newLevel = user.level;
    let newLevelUpXp = user.levelupxp;
    let newRol = user.rolid;

    // Manejo de subida de nivel
    if (newXp >= newLevelUpXp) {
        const oldrol = newRol
        newLevel += Math.floor(newXp / newLevelUpXp);
        newLevelUpXp = Math.round(50 * newLevel);
        newRol = rolManager(newLevel);
        levelupmessage(message, newLevel, guildMember, channel);
        newXp = 0;

        if (oldrol != newRol){
            // Asignar rol en Discord
            if (guildMember) {

                console.log(Guild.RolId1);
                await AssignRole(guildMember, newRol, message, channel, Guild);
            } else {
                console.error("El GuildMember no está definido para la asignación del rol.");
            }
         }
    }

    // Actualiza la base de datos
    await db.run(
        'UPDATE users SET level = ?, xp = ?, levelupxp = ?, rolid = ? WHERE id = ? AND guild = ?',
        [newLevel, newXp, newLevelUpXp, newRol, userId, guildId]
    );

    return {
        level: newLevel,
        xp: newXp,
        levelupxp: newLevelUpXp,
        rolid: newRol,
    };
}

function rolManager(userLevel) {
    switch (true) {
        case userLevel >= 1 && userLevel <= 10:
            return 1;
        case userLevel >= 11 && userLevel <= 20:
            return 2;
        case userLevel >= 21 && userLevel <= 30:
            return 3;
        case userLevel >= 31 && userLevel <= 40:
            return 4;
        case userLevel >= 41 && userLevel <= 50:
            return 5;
        case userLevel >= 51 && userLevel <= 60:
            return 6;
        case userLevel >= 61 && userLevel <= 70:
            return 7;
        case userLevel >= 71 && userLevel <= 80:
            return 8;
        case userLevel >= 81 && userLevel <= 90:
            return 9;
        case userLevel >= 91 && userLevel <= 100:
            return 10;
        case userLevel > 100 && userLevel <= 120:
            return 11;
        case userLevel > 120:
            return 12;
        default:
            return 0; // En caso de que el nivel no encaje en ninguna categoría
    }
}

async function AssignRole(member, rolid, message, channel, Guild) {
    const roleMap = {
            1: Guild.RolId1,
            2: Guild.RolId2,
            3: Guild.RolId3,
            4: Guild.RolId4,
            5: Guild.RolId5,
            6: Guild.RolId6,
            7: Guild.RolId7,
            8: Guild.RolId8,
            9: Guild.RolId9,
            10: Guild.RolId10,
            11: Guild.RolId11,
            12: Guild.RolId12
    };

    const roleId = roleMap[rolid];
    console.log(roleId);
    if (!roleId) {
        console.error(`No se encontró un rol en Discord para rolid = ${rolid}`);
        return;
    }

    try {
        // Elimina los roles previos del usuario que están en `roleMap`
        for (const id of Object.values(roleMap)) {
            if (member.roles.cache.has(id) && id !== roleId) {
                await member.roles.remove(id);
                console.log(`Rol con ID ${id} eliminado de ${member.displayName}`);
            }
        }

        const role = member.guild.roles.cache.get(roleId);
        if (role) {
            // Añade el rol al miembro
            await member.roles.add(role);
            console.log(`Rol ${role.name} asignado a ${member.displayName} (rolid = ${rolid}).`);
            if (channel == null){
                message.reply(`
🎉 **¡Felicidades!**🎉
**Usuario:** <@${member.id}>
**Nuevo Rol:** 🚀 **${role.name}**
Sigue así para llegar más lejos! 🚀💪
                    `);
            }else{
                channel.send(`
🎉 **¡Felicidades!**🎉
**Usuario:** <@${member.id}>
**Nuevo Rol:** 🚀 **${role.name}**
Sigue así para llegar más lejos! 🚀💪
                    `);
            }
        } else {
            console.error(`No se encontró el rol en Discord con ID ${roleId}.`);
        }
    } catch (error) {
        console.error(`Error al asignar el rol: ${error.message}`);
    }
}

export async function reset(guildId, userId) {
    const newLevel = 0; 
    const newXp = 0;
    const newLevelUpXp = 50;
    const newRol = 0;
    await db.run(
        'UPDATE users SET level = ?, xp = ?, levelupxp = ?, rolid = ? WHERE id = ? AND guild = ?',
        [newLevel, newXp, newLevelUpXp, newRol, userId, guildId]
    );
}