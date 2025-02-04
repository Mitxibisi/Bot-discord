import { getGuild, gdb} from "../GuildsConfig/configs.js";

export async function run(message) {
    console.log(message.guild.id);
    gdb.get(`SELECT adminRoleId FROM guilds WHERE guildId = ?`, [message.guild.id], (err, row) => {
            if (err) {
                    console.error('Error en la consulta:', err.message);
                        } else {
                                console.log('adminRoleId:', row ? row.adminRoleId : 'No encontrado');
                                    }
                                    });
    }
    
    
    
