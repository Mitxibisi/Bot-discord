import { Events } from 'discord.js';
import { client, config } from '../index.js';
import { setupDeploymentList } from '../Automatic/deploymentList.js';

export default () => {
    client.on(Events.ClientReady, async () => {
        console.log(`Conectado como ${client.user.tag}!`);
        Deploy(config);
    });
};

export async function Deploy() {
    const deploymentChannelId = config.ListDeploymentChannel;
    const guildId = config.GuildId;
    await setupDeploymentList(deploymentChannelId, guildId);
}