import { reset } from '../usersdb/database.js';

export async function run(message, client, config) {
    // Obtener el GuildMember del autor del mensaje
    const guildMember = await message.guild.members.fetch(message.author.id);

    // ID del rol requerido
    const requiredRoleId = config.adminRoleId;

    // Comprobar si el autor tiene el rol requerido
    if (guildMember.roles.cache.has(requiredRoleId)) {
        // Dividir el mensaje en argumentos
        const args = message.content.split(' ');
        const targetUserMention = args[1]; // Mención del usuario objetivo

        // Obtener usuario objetivo
        let targetMember = guildMember;
        if (targetUserMention) {
            // Validar que se ha mencionado a un usuario
            const match = targetUserMention.match(/^<@!?(\d+)>$/);
            if (!match) {
                return message.reply('Por favor, menciona un usuario válido para resetear.');
            }

            const targetUserId = match[1];
            targetMember = await message.guild.members.fetch(targetUserId).catch(() => null);

            if (!targetMember) {
                return message.reply('No se ha encontrado al usuario mencionado en este servidor.');
            }
        }

        // Preguntar al usuario si desea confirmar
        await message.reply('¿Estás seguro de que deseas resetear? Responde con `Y` o `N`.');

        // Crear un filtro para esperar la respuesta del usuario
        const filter = (response) => {
            return (
                ['y', 'n'].includes(response.content.toLowerCase()) &&
                response.author.id === message.author.id
            );
        };

        // Esperar la respuesta del usuario (máximo 30 segundos)
        try {
            const collected = await message.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000, // 30 segundos
                errors: ['time'],
            });

            const answer = collected.first().content.toLowerCase();
            if (answer === 'y') {
                // Confirmación positiva
                // Resetear miembro
                await reset(targetMember.id);
                return message.reply(`Se ha resetado los datos del usuario: ${targetMember.user.displayName}.`);
            } else if (answer === 'n') {
                // Cancelación
                return message.reply('Acción cancelada.');
            }
        } catch (error) {
            return message.reply('No se recibió una respuesta a tiempo. Acción cancelada.');
        }
    } else {
        // El usuario no tiene el rol requerido
        return message.reply('No tienes los permisos necesarios para ejecutar este comando.');
    }
}