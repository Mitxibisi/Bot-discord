import {client, config} from '../index.js'
import {createGuild} from '../GuildsConfig/configs.js'

export async function run(message) {
    if (message.author.id === config.userId){
        client.guilds.cache.forEach(async (guild) => {
            createGuild(guild.id);
        });
        console.log('Servidores añadidos')
    }
}