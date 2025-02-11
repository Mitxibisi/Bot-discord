import { Events } from 'discord.js';
import { client } from '../index.js';
import { createGuild } from '../GuildsConfig/configs.js';
import { AddAllPlayers } from '../Commands/addAllPlayers.js';
import { Deploy } from './ClientReady.js';
import { OptionsMenu } from '../Automatic/OpcionesMenu.js';

export default () => {
    client.on(Events.GuildCreate, async (guild) => {
        console.log(`🤖 El bot se unió al servidor: ${guild.name} (ID: ${guild.id})`);

        try {
            await createGuild(guild.id);
            await AddAllPlayers(guild);
            await OptionsMenu(guild);
            await Deploy();
            console.log(`✅ Configuración inicial creada para el servidor: ${guild.id}`);
        } catch (error) {
            console.error(`❌ Error al crear la configuración para el servidor ${guild.id}:`, error);
        }
    });
};