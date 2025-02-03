import {client, config} from '../index.js'
import {getGuild} from '../GuildsConfig/configs.js'

export async function run(message) {
    if (message.author.id === config.userId){
Guild = getGuild(messsge.guild.id);
        console.log(Guild);
    }
}