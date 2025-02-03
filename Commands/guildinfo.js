import {client, config} from '../index.js'
import {getGuild} from '../GuildsConfig/configs.js'

export async function run(message) {
    if (message.author.id === config.userId){
const Guild = await getGuild(message.guild.id);
        console.log(Guild);
    }
}