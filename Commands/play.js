import { ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';

export async function run(message) {
    try {
        // Crear un botón interactivo
        const threeButton = new ButtonBuilder()
            .setCustomId('game-three')
            .setLabel('3️⃣') // Texto del        botón
            .setStyle(ButtonStyle.Primary); // Estilo azul

        // Crear un botón interactivo
        const stoneButton = new ButtonBuilder()
            .setCustomId('game-stone')
            .setLabel('✂️') // Texto del botón
            .setStyle(ButtonStyle.Primary); // Estilo azul
    
        // Crear un botón interactivo
        const chessButton = new ButtonBuilder()
            .setCustomId('game-chess')
            .setLabel('♟️') // Texto del botón
            .setStyle(ButtonStyle.Primary); // Estilo azul
        
        // Obtener el nombre del juego (tresenraya)
        const Pl1 = message.author;
        const Pl2 = message.mentions.users.first();

        // Validación de jugadores
        if (!Pl2 || Pl1 === Pl2) {
            return message.reply('Por favor mencione un segundo jugador.');
        }

        // Responder a la confirmación de inicio del juego
        const gameMessage = await message.channel.send({
            content: `**Juegos**`, // Usar el nombre del menú de `menulabel`
            components: [new ActionRowBuilder().addComponents(threeButton, stoneButton, chessButton)],
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

                const menuGames = {
                    'game-three': 'tres',
                    'game-stone': 'piedra',
                    'game-chess': 'ajedrez'
                };

                const Game = menuGames[interaction.customId];

                if (Game){
                    await gameMessage.delete().catch(console.error); // Borra el mensaje con los botones
                    await gamerunner(Game, Pl1, Pl2, message);
                }
            }
        });

        collector.on('end', async () => {
            try {
                await gameMessage.edit({ content: '**El tiempo se ha agotado! ⏳**', components: [] });
            } catch (error) {
                if (error.code === 10008) {
                    console.log('El mensaje ya fue eliminado, no se puede editar.');
                } else {
                    console.error('Error al editar el mensaje:', error);
                }
            }
        });

    } catch (error) {
        console.log(`Error en play: `, error.message);
        message.reply("Hubo un error al iniciar el juego.");
    }
}

async function gamerunner(Game, Pl1, Pl2, message) {
    try{
            // Ejecutar el juego (se importa el módulo del juego según el nombre)
            const commandModule = await import(`./games/${Game}.js`);

            if (typeof commandModule.run === 'function') {
                // Llamar a la función run del juego, pasando los jugadores y el mensaje
                await commandModule.run(Pl1, Pl2, message);
            } else {
                message.reply("Comando no encontrado.");
            }
    }catch(error){console.log(`Error en gamerunner: `,error)}
}