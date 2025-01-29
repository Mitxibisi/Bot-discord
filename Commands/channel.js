import { ActionRowBuilder, StringSelectMenuBuilder, ChannelType } from 'discord.js';
import { client, config } from '../index.js';

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
  const messages = await channel.messages.fetch({ limit: 30 });
  await channel.bulkDelete(messages);
}

export async function run() {
  const guild = client.guilds.cache.get(config.GuildId);
  let channel = guild.channels.cache.get(config.OpcionesId);

  if(!config.OpcionesId){
    channel = guild.systemChannel;
  }else{
    await ChannelClear(channel);
  }

  // Obtén los canales de texto del servidor donde se ejecutó el comando
  const textChannels = guild.channels.cache
    .filter(channel => channel.type === ChannelType.GuildText)
    .map(channel => ({
      label: channel.name, // Nombre del canal
      value: channel.id,   // ID del canal para identificarlo
    }));

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
  const OptionsChannel = MenuBuilder('select-optionschannel', 'Selecciona un canal de texto', textChannels, config.OpcionesId);
  const GuildMember = MenuBuilder('select-guildmemberchannel', 'Selecciona un canal de texto', textChannels, config.GuildMemberAddRemoveId);
  const ListDeployment = MenuBuilder('select-listdeploymentchannel', 'Selecciona un canal de texto', textChannels, config.ListDeploymentChannel);
  const IgnoredChannelAFK = MenuBuilder('select-ignoredchannelafk', 'Selecciona un canal de texto', voiceChannels, config.IgnoredChannelId);
  const VoiceMessagesChannel = MenuBuilder('select-voicemessageschannel', 'Selecciona un canal de texto', textChannels, config.VoiceMessagesChannel);
  const AdminRole = MenuBuilder('select-admrole', 'Selecciona un rol', roles, config.adminRoleId);
  const TemporalChannelsCategory = MenuBuilder ('select-temporalchannelscategory','Selecciona una categoria',categoryChannels ,config.TemporalChannelsId);
  const NewMemberRoleId = MenuBuilder('select-newmemberrole', 'Selecciona un rol', roles, config.NewmemberRoleId);
  const NvRol1 = MenuBuilder('select-nvrol1', 'Selecciona un rol', roles, config.RolId1);
  const NvRol2 = MenuBuilder('select-nvrol2', 'Selecciona un rol', roles, config.RolId2);
  const NvRol3 = MenuBuilder('select-nvrol3', 'Selecciona un rol', roles, config.RolId3);
  const NvRol4 = MenuBuilder('select-nvrol4', 'Selecciona un rol', roles, config.RolId4);
  const NvRol5 = MenuBuilder('select-nvrol5', 'Selecciona un rol', roles, config.RolId5);
  const NvRol6 = MenuBuilder('select-nvrol6', 'Selecciona un rol', roles, config.RolId6);
  const NvRol7 = MenuBuilder('select-nvrol7', 'Selecciona un rol', roles, config.RolId7);
  const NvRol8 = MenuBuilder('select-nvrol8', 'Selecciona un rol', roles, config.RolId8);
  const NvRol9 = MenuBuilder('select-nvrol9', 'Selecciona un rol', roles, config.RolId9);
  const NvRol10 = MenuBuilder('select-nvrol10', 'Selecciona un rol', roles, config.RolId10);
  const NvRol11 = MenuBuilder('select-nvrol11', 'Selecciona un rol', roles, config.RolId11);
  const NvRol12 = MenuBuilder('select-nvrol12', 'Selecciona un rol', roles, config.RolId12);
  const SecretRol1 = MenuBuilder('select-secretrol', 'Selecciona un rol', roles, config.SecretRolId1);

  // Agrega cada menú desplegable a su propia fila
  const row0 = new ActionRowBuilder().addComponents(OptionsChannel);
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

  // Agregar texto antes de cada fila de menú
  await channel.send({
    content: `**Ajustes del servidor:**
    `
  });

  await channel.send({
    content: `**Canal de las opciones:**`,
    components: [row0],
  });

    // Enviar más filas con texto
    await channel.send({
      content: `**Canal de Bienvenidas:**`,
      components: [row1],
    });

  // Enviar más filas con texto
  await channel.send({
    content: `**Canal del Top del server:**`,
    components: [row2],
  });

  await channel.send({
    content: `**Canal AFK:**`,
    components: [row3],
  });

  await channel.send({
    content: `**Subidas de nivel por canales de voz:**`,
    components: [row4],
  });

  await channel.send({
    content: `**Admin Rol:**`,
    components: [row5],
  });

  await channel.send({
      content: `**Categoria para canales temp:**`,
      components: [row6],
  });

  await channel.send({
    content: `**Rol usuario nuevo:**`,
    components: [row7],
  });

  await channel.send({
    content: `**Rol Nv1-10:**`,
    components: [row8],
  });

  await channel.send({
    content: `**Rol Nv11-20:**`,
    components: [row9],
  });

  await channel.send({
    content: `**Rol Nv21-30:**`,
    components: [row10],
  });

  await channel.send({
    content: `**Rol Nv31-40:**`,
    components: [row11],
  });

  await channel.send({
    content: `**Rol Nv41-50:**`,
    components: [row12],
  });

  await channel.send({
    content: `**Rol Nv51-60:**`,
    components: [row13],
  });

  await channel.send({
    content: `**Rol Nv61-70:**`,
    components: [row14],
  });

  await channel.send({
    content: `**Rol Nv71-80:**`,
    components: [row15],
  });

  await channel.send({
    content: `**Rol Nv81-90:**`,
    components: [row16],
  });

  await channel.send({
    content: `**Rol Nv91-100:**`,
    components: [row17],
  });

  await channel.send({
    content: `**Rol Nv101-120:**`,
    components: [row18],
  });

  await channel.send({
    content: `**Rol Nv+120:**`,
    components: [row19],
  });

  await channel.send({
    content: `**Rol Secreto:**`,
    components: [row20],
  });
}