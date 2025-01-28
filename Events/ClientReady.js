import { Events } from 'discord.js';
import { client, config } from '../index.js';
import { setupDeploymentList } from '../automatic/deploymentList.js';

export default (client) => {
    client.on(Events.ClientReady, async () => {
        console.log(`Conectado como ${client.user.tag}!`);
        Deploy(config);
    });
};

export async function Deploy(config) {
    const deploymentChannelId = config.ListDeploymentChannel;
    const guildId = config.GuildId;
    await setupDeploymentList(client, deploymentChannelId, guildId);
}