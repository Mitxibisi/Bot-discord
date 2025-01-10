import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { ConsoleMessage } from 'puppeteer';
import { escapeBulletedList } from 'discord.js';

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
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        levelupxp INTEGER DEFAULT 100,
        rolid INTEGER DEFAULT 1
    )
`);

export async function createUser(userId, username) {
    try {
        const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (!existingUser) {
            await db.run(
                'INSERT INTO users (id, username, level, xp, levelupxp, rolid) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, username, 1, 0, 100, 1]
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

export async function addXp(userId, xpAmount) {
    const user = await getUser(userId);
    if (!user) {
        console.error(`El usuario con ID ${userId} no existe.`);
        return null; // Salimos de la función si el usuario no existe
    }

    const newXp = user.xp + xpAmount;
    let newLevel = user.level;
    let newLevelUpXp = user.levelupxp;
    let newRol = user.rolid;

    // Manejo de subida de nivel
    if (newXp >= newLevelUpXp) {
        newLevel += Math.floor(newXp / newLevelUpXp); // Incrementa nivel
        newLevelUpXp = Math.round(newLevelUpXp * 1.2); // Ajusta XP para subir nivel
        newRol = await  rolManager(newLevel); // Determina nuevo rol
    }


    // Actualiza la base de datos
    await db.run(
        'UPDATE users SET level = ?, xp = ?, levelupxp = ?, rolid = ? WHERE id = ?',
        [newLevel, newXp, newLevelUpXp, newRol, userId]
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
        case userLevel > 100:
            return 11;
        default:
            return 0; // En caso de que el nivel no encaje en ninguna categoría
    }
}
