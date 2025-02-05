import { ActionRowBuilder, StringSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';
import { client } from '../index.js';
import { getGuild } from '../GuildsConfig/configs.js'

function MenuBuilder(CustomId, PlaceHolder, Options, defaultValue = null) {
  // Agregar la propiedad `default: true` a la opción que coincide con el valor predeterminado
  const updatedOptions = Options.map(option => ({
      ...option,
      default: option.value === defaultValue, // Establece `default: true` si coincide
  }));

  // Crea el menú de selección
  const NewMenuBuilder = new StringSelectMenuBuilder()
      .setCustomId(CustomId)
      .setPlaceholder(PlaceHolder)
      .addOptions(updatedOptions.slice(0, 25)); // Máximo 25 opciones

  return NewMenuBuilder;
}

async function ChannelClear(channel){
  try{
    const messages = await channel.messages.fetch({ limit: 30 });
    await channel.bulkDelete(messages);
  }
  catch(error){
    console.log(error);
  }
}

export async function OptionsMenu() {
  try{
    client.guilds.cache.forEach(async (guild) => {
      const Guild = await getGuild(guild.id);
      let categoria = guild.channels.cache.find(c => c.name === "Opciones" && c.type === ChannelType.GuildCategory);
      if (!categoria) {
          categoria = await guild.channels.create({
            name: "Opciones",
            type: ChannelType.GuildCategory
      });
      }
      let channel = guild.channels.cache.find(c => c.name === `goodlife`);
      if (!channel) {
        // Obtener los roles con permisos de administrador
        const adminRoles = guild.roles.cache.filter(role => role.permissions.has(PermissionsBitField.Flags.Administrator));
        
        channel = await guild.channels.create({
            name: `goodlife`,
            type: ChannelType.GuildText,
            parent: categoria.id,
            permissionOverwrites: [
                {
                    id: guild.id, // @everyone
                    deny: [PermissionsBitField.Flags.ViewChannel] // Nadie más puede verlo
                },
                {
                    id: guild.ownerId, // Dueño del servidor
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                // Permitir acceso a roles con permisos de administrador
                ...adminRoles.map(role => ({
                    id: role.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }))
            ]
        });
    }

      await ChannelClear(channel);

      // Obtén los canales de texto del servidor donde se ejecutó el comando
      const textChannels = guild.channels.cache
        .filter(channel => channel.isTextBased() && !channel.isThread())
        .map(channel => ({
          label: channel.name,
          value: channel.id,
      }));

      await guild.roles.fetch(); // Forzar actualización de caché
      // Obtén los roles del servidor donde se ejecutó el comando
      const roles = guild.roles.cache
        .filter(role => !role.managed && role.id !== guild.id) // Excluye roles gestionados y el rol @everyone
        .map(role => ({
          label: role.name, // Nombre del rol
          value: role.id,   // ID del rol para identificarlo
        }));

      // Obtén los canales de texto del servidor donde se ejecutó el comando
      const voiceChannels = guild.channels.cache
        .filter(channel => channel.type === ChannelType.GuildVoice)
        .map(channel => ({
          label: channel.name, // Nombre del canal
          value: channel.id,   // ID del canal para identificarlo
        }));

          // Obtén los canales de texto del servidor donde se ejecutó el comando
      const categoryChannels = guild.channels.cache
      .filter(channel => channel.type === ChannelType.GuildCategory)
      .map(channel => ({
        label: channel.name, // Nombre del canal
        value: channel.id,   // ID del canal para identificarlo
      }));

      // Verifica si hay canales o roles disponibles
      if (textChannels.length === 0 && roles.length === 0 && voiceChannels.length === 0 && categoryChannels.length === 0) {
        return channel.send({
          content: 'No hay canales ni roles disponibles en este servidor.',
        });
      }

      const GuildMember = MenuBuilder('select-guildmemberchannel', 'Selecciona un canal de texto', textChannels, Guild.GuildMemberAddRemoveId);
      const ListDeployment = MenuBuilder('select-listdeploymentchannel', 'Selecciona un canal de texto', textChannels, Guild.ListDeploymentChannel);
      const IgnoredChannelAFK = MenuBuilder('select-ignoredchannelafk', 'Selecciona un canal de texto', voiceChannels, Guild.IgnoredChannelId);
      const VoiceMessagesChannel = MenuBuilder('select-voicemessageschannel', 'Selecciona un canal de texto', textChannels, Guild.VoiceMessagesChannel);
      const AdminRole = MenuBuilder('select-admrole', 'Selecciona un rol', roles, Guild.adminRoleId);
      const TemporalChannelsCategory = MenuBuilder ('select-temporalchannelscategory','Selecciona una categoria',categoryChannels ,Guild.TemporalChannelsId);
      const NewMemberRoleId = MenuBuilder('select-newmemberrole', 'Selecciona un rol', roles, Guild.NewmemberRoleId);
      const NvRol1 = MenuBuilder('select-nvrol1', 'Selecciona un rol', roles, Guild.RolId1);
      const NvRol2 = MenuBuilder('select-nvrol2', 'Selecciona un rol', roles, Guild.RolId2);
      const NvRol3 = MenuBuilder('select-nvrol3', 'Selecciona un rol', roles, Guild.RolId3);
      const NvRol4 = MenuBuilder('select-nvrol4', 'Selecciona un rol', roles, Guild.RolId4);
      const NvRol5 = MenuBuilder('select-nvrol5', 'Selecciona un rol', roles, Guild.RolId5);
      const NvRol6 = MenuBuilder('select-nvrol6', 'Selecciona un rol', roles, Guild.RolId6);
      const NvRol7 = MenuBuilder('select-nvrol7', 'Selecciona un rol', roles, Guild.RolId7);
      const NvRol8 = MenuBuilder('select-nvrol8', 'Selecciona un rol', roles, Guild.RolId8);
      const NvRol9 = MenuBuilder('select-nvrol9', 'Selecciona un rol', roles, Guild.RolId9);
      const NvRol10 = MenuBuilder('select-nvrol10', 'Selecciona un rol', roles, Guild.RolId10);
      const NvRol11 = MenuBuilder('select-nvrol11', 'Selecciona un rol', roles, Guild.RolId11);
      const NvRol12 = MenuBuilder('select-nvrol12', 'Selecciona un rol', roles, Guild.RolId12);
      const SecretRol1 = MenuBuilder('select-secretrol', 'Selecciona un rol', roles, Guild.SecretRolId1);
      
      // Crear un botón interactivo
      const lastButton = new ButtonBuilder()
        .setCustomId('restart-button')
        .setLabel('Actualizar Cambios') // Texto del botón
        .setStyle(ButtonStyle.Primary); // Estilo azul

      const menus = [
        GuildMember, ListDeployment, IgnoredChannelAFK, VoiceMessagesChannel, AdminRole, TemporalChannelsCategory, 
        NewMemberRoleId, NvRol1, NvRol2, NvRol3, NvRol4, NvRol5, NvRol6, NvRol7, NvRol8, NvRol9, NvRol10, NvRol11, 
        NvRol12, SecretRol1, lastButton
      ];

      const menulabel = [
        'GuildMember', 'ListDeployment', 'IgnoredChannelAFK', 'VoiceMessagesChannel', 'AdminRole', 'TemporalChannelsCategory',
        'NewMemberRoleId', 'NvRol1', 'NvRol2', 'NvRol3', 'NvRol4', 'NvRol5', 'NvRol6', 'NvRol7', 'NvRol8', 'NvRol9', 'NvRol10',
        'NvRol11', 'NvRol12', 'SecretRol1', 'lastButton'
      ];

      // Usamos `menulabel` para obtener las etiquetas de los menús
      menus.forEach((menu, index) => {
        const menuName = `Opcion: ${menulabel[index]}` || `Opción ${index + 1}`; // Usa el nombre de `menulabel` o asigna un valor predeterminado

        channel.send({
          content: `**${menuName}:**`, // Usar el nombre del menú de `menulabel`
          components: [new ActionRowBuilder().addComponents(menu)],
        }).catch(error => console.log(`Error en opción ${menuName}:`, error));
      });

    });
  }catch(error){
    console.log(`Error en la ejecucion de las opciones : ${error}`);
  }
}