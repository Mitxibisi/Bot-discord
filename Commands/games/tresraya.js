import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const EMPTY = '⬜';
const X = '❌';
const O = '⭕';
const ROWS = 6;
const COLS = 7;

// Crea un tablero vacío de 6x7
const createBoard = () => Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));

// Comprobar si hay 4 fichas consecutivas en una dirección
const checkWinner = (board, player) => {
    // Comprobación horizontal, vertical y diagonal
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] === player) {
                // Comprobar hacia la derecha (horizontal)
                if (col + 3 < COLS && board[row][col + 1] === player && board[row][col + 2] === player && board[row][col + 3] === player) {
                    return true;
                }
                // Comprobar hacia abajo (vertical)
                if (row + 3 < ROWS && board[row + 1][col] === player && board[row + 2][col] === player && board[row + 3][col] === player) {
                    return true;
                }
                // Comprobar diagonal hacia abajo derecha
                if (row + 3 < ROWS && col + 3 < COLS && board[row + 1][col + 1] === player && board[row + 2][col + 2] === player && board[row + 3][col + 3] === player) {
                    return true;
                }
                // Comprobar diagonal hacia abajo izquierda
                if (row + 3 < ROWS && col - 3 >= 0 && board[row + 1][col - 1] === player && board[row + 2][col - 2] === player && board[row + 3][col - 3] === player) {
                    return true;
                }
            }
        }
    }
    return false;
};

// Generar los botones para el tablero
const generateButtons = (board) => {
    return board.map((row, rowIndex) => 
        row.map((cell, colIndex) => 
            new ButtonBuilder()
                .setCustomId(`btn_${rowIndex}_${colIndex}`)
                .setLabel(cell)
                .setStyle(cell === EMPTY ? ButtonStyle.Secondary : ButtonStyle.Primary)
                .setDisabled(cell !== EMPTY)
        )
    );
};

export async function run(Pl1, Pl2, message) {
    let board = createBoard();
    let currentPlayer = X;
    let players = { [X]: Pl1, [O]: Pl2 };

    if (!players[O]) return message.reply("Debes mencionar a otro jugador para jugar.");

    const updateMessage = async (msg) => {
        const buttons = generateButtons(board);
        const components = [];
        for (let i = 0; i < ROWS; i++) {
            components.push(new ActionRowBuilder().addComponents(buttons[i]));
        }
        await msg.edit({ content: `Turno de ${players[currentPlayer].username}`, components });
    };

    const gameMessage = await message.channel.send({ content: `Turno de ${players[currentPlayer].username}`, components: [] });
    await updateMessage(gameMessage);

    const collector = gameMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (interaction) => {
        if (interaction.user.id !== players[currentPlayer].id) {
            return interaction.reply({ content: "No es tu turno.", ephemeral: true });
        }

        // Obtener la columna seleccionada
        const [rowIndex, colIndex] = interaction.customId.split("_").slice(1).map(Number);

        // Coloca la ficha en la fila más baja disponible de la columna
        let rowToPlace = -1;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][colIndex] === EMPTY) {
                rowToPlace = row;
                break;
            }
        }

        if (rowToPlace === -1) {
            return interaction.reply({ content: "Esta columna está llena.", ephemeral: true });
        }

        // Coloca la ficha del jugador
        board[rowToPlace][colIndex] = currentPlayer;

        // Comprobar si hay un ganador
        if (checkWinner(board, currentPlayer)) {
            await updateMessage(gameMessage);
            return gameMessage.edit({ content: `${players[currentPlayer].username} ha ganado! 🎉`, components: [] });
        }

        // Comprobar empate
        if (!board.some(row => row.includes(EMPTY))) {
            await updateMessage(gameMessage);
            return gameMessage.edit({ content: "¡Es un empate!", components: [] });
        }

        // Cambiar de turno
        currentPlayer = currentPlayer === X ? O : X;
        await updateMessage(gameMessage);

        // Deferir actualización del botón
        if (!interaction.deferred) {
            await interaction.deferUpdate();
        }
    });

    collector.on('end', () => gameMessage.edit({ content: "El juego ha terminado por inactividad.", components: [] }));
}