import { Events } from 'discord.js';
import { client } from '../index.js'; // Asegúrate de importar tu instancia del cliente

export default () => {
    client.on(Events.MessageBulkDelete, (messages) => {
        console.log(`Se eliminaron ${messages.size} mensajes en el canal ${messages.first()?.channel.name}.`);

        // Iterar sobre los mensajes eliminados
        messages.forEach((message) => {
            if (message.partial) {
                console.log(`Mensaje no estaba en caché. ID: ${message.id}`);
            } else {
                console.log(`Mensaje eliminado: "${message.content}" por ${message.author.tag}`);
            }
        });
    });
};