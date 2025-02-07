import { Events } from 'discord.js';
import { client } from '../index.js';
import { setupDeploymentList } from '../Automatic/deploymentList.js';


export default () => {
    client.on(Events.ClientReady, async () => {
        console.log(`Conectado como ${client.user.tag}!`);
        Deploy();
    });

    client.once('ready', () => {
        console.log(`Conectado a ${client.guilds.cache.size} servidor(es).`);
    });

};

export async function Deploy() {
        await setupDeploymentList();
};