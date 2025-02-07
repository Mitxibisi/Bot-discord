import { Events } from 'discord.js';
import { client } from '../index.js';
import { guildDelete } from '../GuildsConfig/configs.js'
import { usersDelete } from '../Usersdb/database.js';
import { ticketsDelete } from '../Tickets/tickets.js';

export default () => {
    client.on(Events.GuildDelete, async (guild) => {
        console.log(`🤖 El bot fue expulsado del servidor: ${guild.name} (ID: ${guild.id})`);

        try {
            await guildDelete(guild.id);
            await usersDelete(guild.id);
            await ticketsDelete(guild.id);
            console.log(`✅ Datos del servidor: ${guild.id} eliminados`);
        } catch (error) {
            console.error(`❌ Error al borrar los datos del servidor ${guild.id}:`, error);
        }
    });
};