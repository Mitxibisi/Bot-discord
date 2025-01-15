import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Conexión inicial a la base de datos
export const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
});

// Crear tabla al iniciar (si no existe)
await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT,
        level INTEGER DEFAULT 0,
        xp INTEGER DEFAULT 0,
        levelupxp INTEGER DEFAULT 50,
        rolid INTEGER DEFAULT 0
    )
`);

export async function createUser(userId, username) {
    try {
        const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (!existingUser) {
            await db.run(
                'INSERT INTO users (id, username, level, xp, levelupxp, rolid) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, username, 0, 0, 50, 0]
            );
            console.log(`Usuario ${username} creado con éxito.`);
        } else {
            console.log(`Usuario ${username} ya existe.`);
        }
    } catch (error) {
        console.error('Error en createUser:', error.message);
    }
}

// Funciones para manejar la base de datos
export async function getUser(userId) {
    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (user) {
            console.log('Usuario encontrado:', user);
            return user;
        } else {
            console.log(`Usuario con ID ${userId} no encontrado.`);
            return null; // Devuelve null explícitamente si no existe
        }
    } catch (error) {
        console.error('Error en getUser:', error.message);
        return null; // En caso de error, también devuelve null
    }
}

export async function addXp(userId, xpAmount, guildMember, message) {
    const user = await getUser(userId);
    if (!user) {
        console.error(`El usuario con ID ${userId} no existe.`);
        return null;
    }

    const newXp = user.xp + xpAmount;
    let newLevel = user.level;
    let newLevelUpXp = user.levelupxp;
    let newRol = user.rolid;

    // Manejo de subida de nivel
    if (newXp >= newLevelUpXp) {
        const oldrol = newRol
        newLevel += Math.floor(newXp / newLevelUpXp);
        newLevelUpXp = Math.round(newLevelUpXp * 1.80);
        newRol = rolManager(newLevel);
        const commandPath = './templates/levelup.js';
        const commandModule = await import(commandPath);
        console.log(`Módulo cargado desde: ${commandPath}`);
        if (typeof commandModule.run === 'function') {
          await commandModule.run(message, newLevel); // Pasa `user` al comando
        }

        if (oldrol != newRol){
            // Asignar rol en Discord
            if (guildMember) {
                await AssignRole(guildMember, newRol, message);
            } else {
                console.error("El GuildMember no está definido para la asignación del rol.");
            }
         }
    }

    // Actualiza la base de datos
    await db.run(
        'UPDATE users SET level = ?, xp = ?, levelupxp = ?, rolid = ? WHERE id = ?',
        [newLevel, newXp % newLevelUpXp, newLevelUpXp, newRol, userId]
    );

    return {
        level: newLevel,
        xp: newXp % newLevelUpXp,
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

async function AssignRole(member, rolid, message) {
    const roleMap = {
        1: '732231534915878943',
        2: '732232053004697653',
        3: '732230701025329284',
        4: '1328442723388096565',
        5: '732232898517663775',
        6: '732229932029050980',
        7: '1328442988942332006',
        8: '1328444632639737941',
        9: '1328444510941745183',
        10: '1328443356858023946',
        11: '1328855786385834098',
        12: '732234069232058440',
    };

    const roleId = roleMap[rolid];
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
            message.reply(`
                	🎉 **¡Felicidades!** 🎉
                **Usuario:** <@${member.id}>
                **Nuevo Rol:** 🚀 **${role.name}**
                ¡Sigue así para llegar más lejos! 🚀💪
                `);
        } else {
            console.error(`No se encontró el rol en Discord con ID ${roleId}.`);
        }
    } catch (error) {
        console.error(`Error al asignar el rol: ${error.message}`);
    }
}

export async function reset(userId) {
    const newLevel = 0; 
    const newXp = 0;
    const newLevelUpXp = 50;
    const newRol = 0;
    await db.run(
        'UPDATE users SET level = ?, xp = ?, levelupxp = ?, rolid = ? WHERE id = ?',
        [newLevel, newXp, newLevelUpXp, newRol, userId]
    );
}
