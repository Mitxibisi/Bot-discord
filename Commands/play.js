import { ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';

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
            .setLabel('✂️') // Texto del botón
            .setStyle(ButtonStyle.Primary); // Estilo azul
    


        // Obtener el nombre del juego (tresenraya)
        const Pl1 = message.author;
        const Pl2 = message.mentions.users.first();
        let Game = null;

        // Validación de jugadores
        if (!Pl2) {
            return message.reply('Por favor menciona al segundo jugador.');
        }

        // Responder a la confirmación de inicio del juego
        const gameMessage = await message.channel.send({
            content: `**Juegos**`, // Usar el nombre del menú de `menulabel`
            components: [new ActionRowBuilder().addComponents(threeButton, stoneButton)],
        });

        const collector = gameMessage.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (interaction) => {
            if (!interaction.isButton()) return;

            if (interaction.customId.startsWith('game-')){    
                // Asegurarse de que solo los jugadores puedan presionar
                if (![Pl1.id, Pl2.id].includes(interaction.user.id)) {
                    return interaction.reply({ content: 'No puedes jugar esta partida.', ephemeral: true });
                }
                
                await interaction.deferUpdate();

                if (interaction.customId === 'game-three'){
                    Game = 'tres';
                    await gamerunner(Game, Pl1, Pl2, message);
                }

                if (interaction.customId === 'game-stone'){
                    Game = 'piedra';
                    await gamerunner(Game, Pl1, Pl2, message);
                }
            }
        });

        // Evento cuando el tiempo se acaba
        collector.on('end', () => {
            gameMessage.edit({ content: '**El tiempo se ha agotado! ⏳**', components: [] });
        });

    } catch (error) {
        console.log(`Error en play: `, error.message);
        message.reply("Hubo un error al iniciar el juego.");
    }
}

async function gamerunner(Game, Pl1, Pl2, message) {
            // Ejecutar el juego (se importa el módulo del juego según el nombre)
            const commandModule = await import(`./games/${Game}.js`);

            if (typeof commandModule.run === 'function') {
                // Llamar a la función run del juego, pasando los jugadores y el mensaje
                await commandModule.run(Pl1, Pl2, message);
            } else {
                message.reply("Comando no encontrado.");
            }
}