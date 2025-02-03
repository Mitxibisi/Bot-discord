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
      const Guild = getGuild(guild.id);
      let categoria = guild.channels.cache.find(c => c.name === "Opciones" && c.type === ChannelType.GuildCategory);
      if (!categoria) {
          categoria = await guild.channels.create({
            name: "Opciones",
            type: ChannelType.GuildCategory
      });
      }
      let channel = guild.channels.cache.find(c => c.name === `goodlife`);
      if (!channel) {
        channel = await guild.channels.create({
          name: `goodlife`,
          type: ChannelType.GuildText,
          parent: categoria.id,
          permissionOverwrites: [
            ...(Guild.adminRoleId && Guild.adminRoleId !== '' ? [{
              id: Guild.adminRoleId,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            }] : []), // Si el rol es válido, se incluye el permiso, de lo contrario, no se añade nada
            {
              id: guild.id, // @everyone
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
              deny: [PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.SendMessages], // Silenciar el canal para todos
            },
          ],
        });
      
        // Asegurarse de que el canal esté silenciado
        channel.permissionOverwrites.edit(guild.id, {
          SEND_MESSAGES: false,  // No permitir que los usuarios envíen mensajes (solo el bot puede hacerlo)
          VIEW_CHANNEL: true,    // Los usuarios pueden ver el canal
          MENTION_EVERYONE: false, // No permitir menciones @everyone
        });
      };

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
        .setLabel('Confirmar Guilduración') // Texto del botón
        .setStyle(ButtonStyle.Primary); // Estilo azul


      // Agrega cada menú desplegable a su propia fila
      const row1 = new ActionRowBuilder().addComponents(GuildMember);
      const row2 = new ActionRowBuilder().addComponents(ListDeployment);
      const row3 = new ActionRowBuilder().addComponents(IgnoredChannelAFK);
      const row4 = new ActionRowBuilder().addComponents(VoiceMessagesChannel);
      const row5 = new ActionRowBuilder().addComponents(AdminRole);
      const row6 = new ActionRowBuilder().addComponents(TemporalChannelsCategory);
      const row7 = new ActionRowBuilder().addComponents(NewMemberRoleId);
      const row8 = new ActionRowBuilder().addComponents(NvRol1);
      const row9 = new ActionRowBuilder().addComponents(NvRol2);
      const row10 = new ActionRowBuilder().addComponents(NvRol3);
      const row11 = new ActionRowBuilder().addComponents(NvRol4);
      const row12 = new ActionRowBuilder().addComponents(NvRol5);
      const row13 = new ActionRowBuilder().addComponents(NvRol6);
      const row14 = new ActionRowBuilder().addComponents(NvRol7);
      const row15 = new ActionRowBuilder().addComponents(NvRol8);
      const row16 = new ActionRowBuilder().addComponents(NvRol9);
      const row17 = new ActionRowBuilder().addComponents(NvRol10);
      const row18 = new ActionRowBuilder().addComponents(NvRol11);
      const row19 = new ActionRowBuilder().addComponents(NvRol12);
      const row20 = new ActionRowBuilder().addComponents(SecretRol1);
      const buttonRow = new ActionRowBuilder().addComponents(lastButton);

      await Promise.all([
        channel.send({
          content: `**Ajustes del servidor:**`,
        }).catch(error => console.log("Error en Ajustes del servidor:", error)),
      
        channel.send({
          content: `**Canal de Bienvenidas:**`,
          components: [row1],
        }).catch(error => console.log("Error en Canal de Bienvenidas:", error)),
      
        channel.send({
          content: `**Canal del Top del server:**`,
          components: [row2],
        }).catch(error => console.log("Error en Canal del Top del server:", error)),
      
        channel.send({
          content: `**Canal AFK:**`,
          components: [row3],
        }).catch(error => console.log("Error en Canal AFK:", error)),
      
        channel.send({
          content: `**Subidas de nivel por canales de voz:**`,
          components: [row4],
        }).catch(error => console.log("Error en Subidas de nivel por canales de voz:", error)),
      
        channel.send({
          content: `**Admin Rol:**`,
          components: [row5],
        }).catch(error => console.log("Error en Admin Rol:", error)),
      
        channel.send({
          content: `**Categoria para canales temp:**`,
          components: [row6],
        }).catch(error => console.log("Error en Categoria para canales temp:", error)),
      
        channel.send({
          content: `**Rol usuario nuevo:**`,
          components: [row7],
        }).catch(error => console.log("Error en Rol usuario nuevo:", error)),
      
        channel.send({
          content: `**Rol Nv1-10:**`,
          components: [row8],
        }).catch(error => console.log("Error en Rol Nv1-10:", error)),
      
        channel.send({
          content: `**Rol Nv11-20:**`,
          components: [row9],
        }).catch(error => console.log("Error en Rol Nv11-20:", error)),
      
        channel.send({
          content: `**Rol Nv21-30:**`,
          components: [row10],
        }).catch(error => console.log("Error en Rol Nv21-30:", error)),
      
        channel.send({
          content: `**Rol Nv31-40:**`,
          components: [row11],
        }).catch(error => console.log("Error en Rol Nv31-40:", error)),
      
        channel.send({
          content: `**Rol Nv41-50:**`,
          components: [row12],
        }).catch(error => console.log("Error en Rol Nv41-50:", error)),
      
        channel.send({
          content: `**Rol Nv51-60:**`,
          components: [row13],
        }).catch(error => console.log("Error en Rol Nv51-60:", error)),
      
        channel.send({
          content: `**Rol Nv61-70:**`,
          components: [row14],
        }).catch(error => console.log("Error en Rol Nv61-70:", error)),
      
        channel.send({
          content: `**Rol Nv71-80:**`,
          components: [row15],
        }).catch(error => console.log("Error en Rol Nv71-80:", error)),
      
        channel.send({
          content: `**Rol Nv81-90:**`,
          components: [row16],
        }).catch(error => console.log("Error en Rol Nv81-90:", error)),
      
        channel.send({
          content: `**Rol Nv91-100:**`,
          components: [row17],
        }).catch(error => console.log("Error en Rol Nv91-100:", error)),
      
        channel.send({
          content: `**Rol Nv101-120:**`,
          components: [row18],
        }).catch(error => console.log("Error en Rol Nv101-120:", error)),
      
        channel.send({
          content: `**Rol Nv+120:**`,
          components: [row19],
        }).catch(error => console.log("Error en Rol Nv+120:", error)),
      
        channel.send({
          content: `**Rol Secreto:**`,
          components: [row20],
        }).catch(error => console.log("Error en Rol Secreto:", error)),
      
        // Enviar el botón como último mensaje
        channel.send({
          content: `✅ **Haz clic en el botón para confirmar la Guilduración.**`,
          components: [buttonRow],
        }).catch(error => console.log("Error en el botón de confirmación:", error)),
      ]);
    });
  }catch(error){
    console.log(`Error en la ejecucion de las opciones : ${error}`);
  }
}