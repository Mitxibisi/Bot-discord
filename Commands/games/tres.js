import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const EMPTY = '⬜';
const X = '❌';
const O = '⭕';

const createBoard = () => Array(9).fill(EMPTY);

const checkWinner = (board, player) => {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombos.some(combo => combo.every(index => board[index] === player));
};

const generateButtons = (board) => {
    return board.map((cell, i) => 
        new ButtonBuilder()
            .setCustomId(`btn_${i}`)
            .setLabel(cell)
            .setStyle(cell === EMPTY ? ButtonStyle.Secondary : ButtonStyle.Primary)
            .setDisabled(cell !== EMPTY)
    );
};

export async function run(Pl1, Pl2, message) {
    let board = createBoard();
    let currentPlayer = X;
    let players = { [X]: Pl1, [O]: Pl2 };

    const updateMessage = async (msg) => {
        const buttons = generateButtons(board);
        const components = [
            new ActionRowBuilder().addComponents(buttons.slice(0, 3)),
            new ActionRowBuilder().addComponents(buttons.slice(3, 6)),
            new ActionRowBuilder().addComponents(buttons.slice(6, 9))
        ];
        await msg.edit({ content: `Turno de ${players[currentPlayer]}`, components });
    };

    const gameMessage = await message.channel.send({ content: `Turno de ${players[currentPlayer]}`, components: [] });
    await updateMessage(gameMessage);

    const collector = gameMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (interaction) => {

        if (interaction.customId.startsWith('choice_')) {
            // Esta interacción es parte del juego, no la proceses aquí
            return;
        }
            if (interaction.user.id !== players[currentPlayer].id) {
                return interaction.reply({ content: "No es tu turno.", ephemeral: true });
            }

            const index = parseInt(interaction.customId.replace("btn_", ""));
            if (board[index] !== EMPTY) return;

            board[index] = currentPlayer;

            // Comprobación del ganador
            if (checkWinner(board, currentPlayer)) {
                await updateMessage(gameMessage);
                return gameMessage.edit({ content: `${players[currentPlayer]} ha ganado! 🎉`, components: [] });
            }

            // Comprobación de empate
            if (!board.includes(EMPTY)) {
                await updateMessage(gameMessage);
                return gameMessage.edit({ content: "¡Es un empate!", components: [] });
            }

            // Alternar turno
            currentPlayer = currentPlayer === X ? O : X;
            await updateMessage(gameMessage);

            // Deferir solo si no se ha respondido ya
            if (!interaction.deferred) {
                await interaction.deferUpdate();
            }
    });

    collector.on('end', () => gameMessage.edit({ content: "El juego ha terminado por inactividad.", components: [] }));
}