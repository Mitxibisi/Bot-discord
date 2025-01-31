import { getUser } from '../Usersdb/database.js';
import { perfilembed } from '../Templates/perfil.js'

export async function run(message) {
    try {
        const guildId = message.guild.id;
        const guildMember = await message.guild.members.fetch(message.author.id);
        const args = message.content.split(' ');
        const targetUserMention = args[1]; // Mención del usuario objetivo
    
        // Obtener usuario objetivo
        let targetMember;
        if (targetUserMention) {
            // Validar que se ha mencionado a un usuario
            const match = targetUserMention.match(/^<@!?(\d+)>$/);
            if (!match) {
                return message.reply('Por favor, menciona un usuario válido.');
            }
    
            const targetUserId = match[1];
            targetMember = await message.guild.members.fetch(targetUserId).catch(() => null);
    
            if (!targetMember) {
                return message.reply('No se ha encontrado al usuario mencionado en este servidor.');
            }
        } else {
            // Si no se menciona, se resetea al autor en la base de datos
            targetMember = guildMember;
        }
    
        // Resetear miembro
        const user = await getUser(guildId,targetMember.id); // Obtén los datos del usuario de la base de datos
            console.log(user); // Para depuración
            console.log("Intentando cargar el comando: embed");
            perfilembed(message, user);
    }  catch (error) {
           console.error(`Error en perfil: ${error.message}`);
           message.reply('Error al generar el perfil');
        }
}