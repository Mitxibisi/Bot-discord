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
                                                            .setCustomId(i.toString())
                                                                        .setLabel(cell)
                                                                                    .setStyle(cell === EMPTY ? ButtonStyle.Secondary : ButtonStyle.Primary)
                                                                                                .setDisabled(cell !== EMPTY)
                                                                                                    );
                                                                                                    };

                                                                                                    export async function run(user, message) {
                                                                                                        let board = createBoard();
                                                                                                            let currentPlayer = X;
                                                                                                                let players = { [X]: message.author, [O]: message.mentions.users.first() };

                                                                                                                    if (!players[O]) return message.reply("Debes mencionar a otro jugador para jugar.");

                                                                                                                        const updateMessage = async (msg) => {
                                                                                                                                const components = [
                                                                                                                                            new ActionRowBuilder().addComponents(generateButtons(board).slice(0, 3)),
                                                                                                                                                        new ActionRowBuilder().addComponents(generateButtons(board).slice(3, 6)),
                                                                                                                                                                    new ActionRowBuilder().addComponents(generateButtons(board).slice(6, 9))
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

                                                                                                                                                                                                                                            const index = parseInt(interaction.customId);
                                                                                                                                                                                                                                                    if (board[index] !== EMPTY) return;

                                                                                                                                                                                                                                                            board[index] = currentPlayer;
                                                                                                                                                                                                                                                                    if (checkWinner(board, currentPlayer)) {
                                                                                                                                                                                                                                                                                await updateMessage(gameMessage);
                                                                                                                                                                                                                                                                                            return gameMessage.edit({ content: `${players[currentPlayer]} ha ganado! 🎉`, components: [] });
                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                            if (!board.includes(EMPTY)) {
                                                                                                                                                                                                                                                                                                                        await updateMessage(gameMessage);
                                                                                                                                                                                                                                                                                                                                    return gameMessage.edit({ content: "¡Es un empate!", components: [] });
                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                    currentPlayer = currentPlayer === X ? O : X;
                                                                                                                                                                                                                                                                                                                                                            await updateMessage(gameMessage);
                                                                                                                                                                                                                                                                                                                                                                    await interaction.deferUpdate();
                                                                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                                                                            collector.on('end', () => gameMessage.edit({ content: "El juego ha terminado por inactividad.", components: [] }));
                                                                                                                                                                                                                                                                                                                                                                            }

