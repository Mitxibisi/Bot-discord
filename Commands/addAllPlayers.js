import { createUser } from '../Usersdb/database.js';
import { config } from '../index.js';

export async function run(message) {
    // Confirmación positiva: Agregar a todos los miembros
    const guild = message.guild;
    const members = await guild.members.fetch(); // Obtener todos los miembros del servidor

    let addedCount = 0;
    for (const [id, member] of members) {
        if (!member.user.bot) {
            // Llamar a la función para añadir a la base de datos
            await createUser(guild.id, id, member.user.username);
            addedCount++;
        }
     }

    return message.reply(
        `Se han añadido ${addedCount} miembros a la base de datos exitosamente.`);
}