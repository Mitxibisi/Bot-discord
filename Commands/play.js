import { ActionRowBuilder, StringSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';

export async function run(message) {
    try {
      // Crear un botón interactivo
      const threeButton = new ButtonBuilder()
        .setCustomId('game-three')
        .setLabel('⭕❌') // Texto del        botón
        .setStyle(ButtonStyle.Primary); // Estilo azul

     // Crear un botón interactivo
      const stoneButton = new ButtonBuilder()
        .setCustomId('game-stone')
        .setLabel('⭕❌') // Texto del        botón
        .setStyle(ButtonStyle.Primary); // Estilo azul


        // Obtener el nombre del juego (tresenraya)
        const Game = message.content.split(' ')[1];
        const Pl1 = message.author;
        const Pl2 = message.mentions.users.first();

        // Validación de jugadores
        if (!Pl2) {
            return message.reply('Por favor menciona al segundo jugador.');
        }

        // Responder a la confirmación de inicio del juego
        message.reply({
content:

});

        // Ejecutar el juego (se importa el módulo del juego según el nombre)
        const commandModule = await import(`./games/${Game}.js`);

        if (typeof commandModule.run === 'function') {
            // Llamar a la función run del juego, pasando los jugadores y el mensaje
            await commandModule.run(Pl1, Pl2, message);
        } else {
            message.reply("Comando no encontrado.");
        }

    } catch (error) {
        console.log(`Error en play: `, error.message);
        message.reply("Hubo un error al iniciar el juego.");
    }
}