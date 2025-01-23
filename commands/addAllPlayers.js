import { createUser } from '../usersdb/database.js';

export async function run(message, client, config) {
    // Obtener el GuildMember del autor del mensaje
    const guildMember = await message.guild.members.fetch(message.author.id);

    // ID del rol requerido
    const requiredRoleId = config.adminRoleId;

    // Comprobar si el autor tiene el rol requerido
    if (!guildMember.roles.cache.has(requiredRoleId)) {
        return message.reply('No tienes los permisos necesarios para ejecutar este comando.');
                                    }

    // Confirmar acción con el usuario
    await message.reply(
    'Este comando añadirá a todos los miembros del servidor a la base de datos. ¿Estás seguro? Responde con `Y` o `N`.'
    );

    const filter = (response) => {
     return (
       ['y', 'n'].includes(response.content.toLowerCase()) &&
       response.author.id === message.author.id
        );
    };

    try {
        const collected = await message.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000, // 30 segundos
            errors: ['time'],
            });

            const answer = collected.first().content.toLowerCase();
            if (answer === 'y') {
                // Confirmación positiva: Agregar a todos los miembros
                const guild = message.guild;
                const members = await guild.members.fetch(); // Obtener todos los miembros del servidor

                let addedCount = 0;
                for (const [id, member] of members) {
                    if (!member.user.bot) {
                        // Llamar a la función para añadir a la base de datos
                        await createUser(id, member.user.username);
                        addedCount++;
                    }
                 }

                return message.reply(
                    `Se han añadido ${addedCount} miembros a la base de datos exitosamente.`
                );
                } else if (answer === 'n') {
                return message.reply('Acción cancelada.');
                }
    } catch (error) {
        return message.reply('No se recibió una respuesta a tiempo. Acción cancelada.');
        }
}