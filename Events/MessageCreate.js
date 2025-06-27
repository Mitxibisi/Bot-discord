// Importa los eventos predefinidos de Discord.js
import { Events } from 'discord.js';
// Importa la instancia del cliente desde el archivo principal
import { client } from '../index.js';
// Importa la función para agregar experiencia a los usuarios
import { addXp } from '../Usersdb/database.js';
// Importa la función para obtener la configuración de un servidor
import { getGuild } from '../GuildsConfig/configs.js';

// Mapa para controlar el cooldown (tiempo de espera) entre mensajes de cada usuario
// Evita spam de experiencia
const userCooldowns = new Map();

// Función por defecto que registra el evento cuando se crea un mensaje
export default () => {
    // Evento que se ejecuta cada vez que alguien envía un mensaje en cualquier canal
    client.on(Events.MessageCreate, async (message) => {
        // Filtro: ignora todos los mensajes enviados por bots
        if (message.author.bot) return;
        
        // Obtiene la configuración específica del servidor donde se envió el mensaje
        const Guild = await getGuild(message.guild.id);

        // SISTEMA DE COMANDOS: verifica si el mensaje comienza con '%'
        if (message.content.startsWith('%')) {
            // Extrae el nombre del comando (primera palabra después del %)
            const args = message.content.slice(1).split(' ')[0];  // Remueve '%' y toma el comando
            try{
                // Intenta cargar dinámicamente el archivo del comando desde la carpeta Commands
                const commandPath = `../Commands/${args}.js`;
                const commandModule = await import(commandPath);
                console.log(`La Guild ${message.guild.name} - ${message.guild.id} cargo el módulo: ${commandPath}`);

                // Lista de comandos que requieren permisos de administrador
                const adminKeys = ['addAllPlayers', 'clear', 'reset', 'updateTop', 'tk']

                // COMANDOS NORMALES: Si NO es un comando de admin
                if (!adminKeys.includes(args)){
                    try {
                        // Verifica que el módulo tenga una función 'run' y la ejecuta
                        if (typeof commandModule.run === 'function') {
                            await commandModule.run(message, Guild);
                        } else {
                            console.error(`El comando ${args} no tiene una función 'run'.`);
                            message.reply("Comando no encontrado.");
                        }
                    } catch (error) {
                        console.error(`Error al ejecutar el comando ${args}:`, error);
                        message.reply("Hubo un error al ejecutar el comando.");
                    }
                }else {
                    // COMANDOS DE ADMINISTRADOR: requieren verificación de permisos y confirmación
                    try {
                        // Obtiene el objeto GuildMember para verificar roles
                        const guildMember = await message.guild.members.fetch(message.author.id);
                        const Guild = await getGuild(message.guild.id)
                
                        // VERIFICACIÓN DE PERMISOS: comprueba si el usuario tiene el rol de admin
                        if (!guildMember.roles.cache.has(Guild.adminRoleId)) {
                            // El usuario no tiene permisos de administrador
                            return message.reply('No tienes los permisos necesarios para ejecutar este comando.');
                        }
                
                        // CONFIRMACIÓN DE SEGURIDAD: pide confirmación para comandos peligrosos
                        await message.reply('¿Estás seguro de que deseas ejecutar el comando? Responde con `Y` o `N`.');
                
                        // Filtro para validar la respuesta del usuario
                        const filter = (response) => {
                            return (
                                ['y', 'n'].includes(response.content.toLowerCase()) &&  // Solo acepta Y o N
                                response.author.id === message.author.id               // Solo del mismo usuario
                            );
                        };
                
                        // ESPERA LA RESPUESTA: máximo 15 segundos para confirmar
                        const collected = await message.channel.awaitMessages({
                            filter,
                            max: 1,           // Solo una respuesta
                            time: 15000,      // 15 segundos de timeout
                            errors: ['time'], // Error si se agota el tiempo
                        });
                
                        const answer = collected.first().content.toLowerCase();
                
                        // PROCESAMIENTO DE LA RESPUESTA
                        if (answer === 'y') {
                            // Confirmación positiva: ejecuta el comando
                            if (typeof commandModule.run === 'function') {
                                await commandModule.run(message,Guild);
                            } else {
                                console.error(`El comando ${args} no tiene una función 'run'.`);
                                return message.reply('Comando no encontrado.');
                            }
                        } else if (answer === 'n') {
                            // Cancelación: no ejecuta el comando
                            return message.reply('Acción cancelada.');
                        }
                    } catch (error) {
                        // Manejo de errores en comandos de admin
                        if (error.name === 'Error [time]') {
                            return message.reply('No se recibió una respuesta a tiempo. Acción cancelada.');
                        }
                        console.error('Error al procesar el comando:', error.message);
                        return message.reply('Ocurrió un error al procesar el comando.');
                    }
                }
            }catch(error){
                // Error al cargar el comando: el archivo no existe
                console.log(`Error al intentar cargar el comando ${args}: `,error)
                message.reply(`El comando ${args} no existe`)
            }
        }else if (message.content.length > 1){
            // SISTEMA DE EXPERIENCIA: se ejecuta para mensajes normales (no comandos)
            const guildId = message.guild.id;
            const userId = message.author.id;
            const now = Date.now();
            const cooldownTime = 2000; // Cooldown de 2 segundos entre mensajes
        
            // CONTROL DE COOLDOWN: evita spam de experiencia
            if (userCooldowns.has(userId)) {
                const lastMessageTime = userCooldowns.get(userId);
                const timeDifference = now - lastMessageTime;
        
                // Si aún está en cooldown, no otorga experiencia
                if (timeDifference < cooldownTime) {
                    return; // Sale sin hacer nada
                }
            }
        
            // OTORGAMIENTO DE EXPERIENCIA
            const xpAmount = 50; // Cantidad base de experiencia por mensaje

            // Obtiene el GuildMember para verificar roles
            const guildMember = await message.guild.members.fetch(userId);

            // Lista de todos los roles de nivel configurados en el servidor
            const rolKeys = [
                'RolId1', 'RolId2', 'RolId3', 'RolId4', 'RolId5', 'RolId6',
                'RolId7', 'RolId8', 'RolId9', 'RolId10', 'RolId11', 'RolId12'
            ];

            // Solo otorga XP si TODOS los roles de nivel están configurados
            if (rolKeys.every(key => Guild[key] !== null)) {
                await addXp(guildId, userId, xpAmount, guildMember, message, null, Guild);
            }

            // Actualiza el timestamp del último mensaje para el cooldown
            userCooldowns.set(userId, now);
        }    
    });
};