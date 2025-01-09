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
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        levelupxp INTEGER DEFAULT 100,
        rolid INTEGER DEFAULT 1
    )
`);

export async function createUser(userId, username) {
    // Verifica si el usuario ya existe
    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    if (!existingUser) {
     // Si no existe, lo inserta en la base de datos
      await db.run(
       'INSERT INTO users (id, username, level, xp, levelupxp, rolid) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, username, 1, 0, 100, 1]
        );
    console.log(`Usuario ${username} creado con éxito.`);
    }

}

// Funciones para manejar la base de datos
export async function getUser(userId) {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    console.log(user);
    return user || { id: userId, level: 1, xp: 0 };
}

export async function addXp(userId, xpAmount) {
    const user = await getUser(userId);
    const newXp = user.xp + xpAmount;
    let newLevel = user.level;
    let newlevelupxp = user.levelupxp;
    let newrol = user.rolid;

    if (newXp >= newlevelupxp) {
        newLevel += Math.floor(newXp / newlevelupxp);
        newlevelupxp = user.levelupxp + (user.levelupxp * 0.20);
        newrol = rolManager(newLevel);
    }

    await db.run(
        'INSERT OR REPLACE INTO users (id, username, level, xp, levelupxp, rolid) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, user.username || 'Unknown', newLevel, newXp % newlevelupxp, newlevelupxp, newrol]
    );
    return { level: newLevel, xp: newXp % newlevelupxp, levelupxp: newlevelupxp, rol: newrol};

    function rolManager(userlevel){
        switch (userlevel){
            case 1,2,3,4,5,6,7,8,9,10:
                return 1;
            case 11,12,13,14,15,16,17,18,19,20:
                return 2;
            case 21,22,23,24,25,26,27,28,29,30:
                return 3;
        }
    }
}