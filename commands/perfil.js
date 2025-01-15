import { getUser } from '../usersdb/database.js';
import { perfilembed } from '../templates/perfil.js'

export async function run(message) {
    try {
        const user = await getUser(message.author.id); // Obtén los datos del usuario de la base de datos
        console.log(user); // Para depuración
        console.log("Intentando cargar el comando: embed");
        perfilembed(message, user);
    } catch (error) {
           console.error(`Error en perfil: ${error.message}`);
           message.reply('Error al generar el perfil');
        }
}