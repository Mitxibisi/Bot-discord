import { Deploy } from "../Events/ClientReady.js";

export async function run(message) {

    try{
        Deploy();
        message.reply('Ranking del server actualizado')
        // El usuario no tiene el rol requerido
        return message.reply('No tienes los permisos necesarios para ejecutar este comando.');
    }
    catch(error){
        console.log(`Error al actualizar ranking: ${error}`);
    }
}