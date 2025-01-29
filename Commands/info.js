import { EmbedBuilder } from 'discord.js';
import { client } from '../index.js';


export async function run(message) {
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#00ff00') // Verde brillante
                    .setTitle('✨ Información del Bot ✨')
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
                    .setDescription(`
                    **Información del Bot:**
                    - Nombre del bot: **GoodLife Bot** 🤖
                    - Versión: **1.0.0** 🔧
                    - Desarrollado para proporcionar asistencia y comandos útiles en este servidor. 💬
                    - Este bot fue creado para facilitar la gestión y la interacción en el servidor. ⚙️

                    **Creador:**
                    - Nombre: **Mitxibisi** 👨‍💻
                    - Desarrollador y creador del bot. 🚀
                    `)
                    .setFooter({ 
                        text: 'GoodLife Info 🌟',  
                    })
            ]
        });
}