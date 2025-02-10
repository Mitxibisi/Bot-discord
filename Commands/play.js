export async function run(message) {
    try{
        let FinPartida = false;
        const Game = message.content.split(' ')[1];
        const Pl1 = message.author;
        const Pl2 = message.mentions.users.first();
        let id = 1;

        if(!Pl2){
            message.reply('Por favor mecione al segundo jugador');
        }else{
            message.reply('Comenzando juego');

            while(!FinPartida){
                const targetUser = id === 1 ? Pl1 : Pl2; // Selecciona entre Pl1 y Pl2
    
                const filter = (response) => {
                    return (
                        response.author.id === targetUser.id
                    );
                };
    
                try{
                    // Esperar la respuesta del usuario (máximo 15 segundos)
                    const collected = await message.channel.awaitMessages({
                        filter,
                        max: 1,
                        time: 15000, // 15 segundos
                        errors: ['time'],
                    });
    
                    const answer = collected.first().content.toLowerCase();
    
                    if (answer){
                        const commandPath = `./games/${Game}.js`;
                        const commandModule = await import(commandPath);

                        if (typeof commandModule.run === 'function') {
                            await commandModule.run(Pl1, Pl2, message);
                        } else {
                            console.error(`El comando ${args} no tiene una función 'run'.`);
                            message.reply("Comando no encontrado.");
                        }
                    }
    
                } catch (error) {
                    FinPartida = true; // Finaliza la partida si hay otro tipo de error
                    }
    
                 // Alternar turno solo si no se ha terminado la partida
                 if (!FinPartida) {
                    id = id === 1 ? 2 : 1;
                }
            }
            message.reply('Fin de la partida');
            FinPartida = false;
        }

    } catch (error) {
        console.log(`Error en play: `, error.message);
    }
}