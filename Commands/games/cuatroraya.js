import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const EMPTY = '⬜';
const X = '❌';
const O = '⭕';

const createBoard = () => Array(42).fill(EMPTY);

const checkWinner = (board, player) => {
    const winningCombos = [
        
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

    if (!players[O]) return message.reply("Debes mencionar a otro jugador para jugar.");

    const updateMessage = async (msg) => {
        const buttons = generateButtons(board);
        const components = [
            new ActionRowBuilder().addComponents(buttons.slice(0, 7)),
            new ActionRowBuilder().addComponents(buttons.slice(7, 14)),
            new ActionRowBuilder().addComponents(buttons.slice(14, 21)),
            new ActionRowBuilder().addComponents(buttons.slice(21, 28)),
            new ActionRowBuilder().addComponents(buttons.slice(35, 42))
        ];
        await msg.edit({ content: `Turno de ${players[currentPlayer]}`, components });
    };

    const gameMessage = await message.channel.send({ content: `Turno de ${players[currentPlayer]}`, components: [] });
    await updateMessage(gameMessage);

    const collector = gameMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (interaction) => {
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