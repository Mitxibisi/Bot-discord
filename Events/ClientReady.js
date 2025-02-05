import { Events } from 'discord.js';
import { client } from '../index.js';
import { setupDeploymentList } from '../Automatic/deploymentList.js';
import { OptionsMenu } from '../Automatic/OpcionesMenu.js';

export default () => {
    client.on(Events.ClientReady, async () => {
        console.log(`Conectado como ${client.user.tag}!`);
        OptionsMenu();
        Deploy();
    });

    client.once('ready', () => {
        console.log(`Conectado a ${client.guilds.cache.size} servidor(es).`);
    });

};

export async function Deploy() {
        await setupDeploymentList();
    };