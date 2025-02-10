import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const choices = ['Piedra', 'Papel', 'Tijeras'];  // Opciones del juego
const emojiChoices = ['🪨', '📄', '✂️']; // Los emojis para los botones

export async function run(Pl1, Pl2, message) {
    let player1Choice = null;
    let player2Choice = null;

    // Crear los botones para las elecciones
    const buttons = choices.map((choice, index) => 
        new ButtonBuilder()
            .setCustomId(`choice_${index}`)
            .setLabel(emojiChoices[index])
            .setStyle(ButtonStyle.Primary)
    );

    const row = new ActionRowBuilder().addComponents(buttons);

    const gameMessage = await message.channel.send({ 
        content: '¡Es el turno de ambos jugadores! Elijan su opción:',
        components: [row] 
    });

    // Crear el colector de interacciones
    const collector = gameMessage.createMessageComponentCollector({ time: 30000 });

    collector.on('collect', async (interaction) => {
if (interaction.customId.startsWith('btn_')) {
    // Esta interacción es parte del juego, no la proceses aquí
    return;
}
        // Verificar si la interacción es de uno de los jugadores
        if (interaction.user.id === Pl1.id || interaction.user.id === Pl2.id) {
            const choiceIndex = parseInt(interaction.customId.split('_')[1]);
            if (interaction.user.id === Pl1.id) {
                player1Choice = choices[choiceIndex];
                await interaction.deferUpdate();
            } else if (interaction.user.id === Pl2.id) {
                player2Choice = choices[choiceIndex];
                await interaction.deferUpdate();
            }
        }

        // Comprobar si ambos jugadores han hecho su elección
        if (player1Choice !== null && player2Choice !== null) {
            let result = '';
            if (player1Choice === player2Choice) {
                result = '¡Es un empate!';
            } else if (
                (player1Choice === 'Piedra' && player2Choice === 'Tijeras') ||
                (player1Choice === 'Papel' && player2Choice === 'Piedra') ||
                (player1Choice === 'Tijeras' && player2Choice === 'Papel')
            ) {
                result = `${Pl1.username} ha ganado! 🎉`;
            } else {
                result = `${Pl2.username} ha ganado! 🎉`;
            }

            await gameMessage.edit({ content: result, components: [] });
            collector.stop();
        }
    });

    collector.on('end', async () => {
        if (player1Choice === null || player2Choice === null) {
            await gameMessage.edit({ content: 'El tiempo ha expirado sin que ambos jugadores elijan.', components: [] });
        }
    });
}