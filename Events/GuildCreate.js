import { Events } from 'discord.js';
import { client, config } from '../index.js';
import { setupDeploymentList } from '../Automatic/deploymentList.js';
import { OptionsMenu } from '../Automatic/OpcionesMenu.js';

export default () => {
    client.on(Events.GuildCreate, async () => {
        console.log(`Conectado a un nuevo servidor`);
        await OptionsMenu();
        await Deploy(config);
    });
};

async function Deploy() {
    const deploymentChannelId = config.ListDeploymentChannel;
    const guildId = config.GuildId;
    await setupDeploymentList(deploymentChannelId, guildId);
}