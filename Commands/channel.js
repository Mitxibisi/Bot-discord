import { ActionRowBuilder, StringSelectMenuBuilder, ChannelType } from 'discord.js';
import { config } from '../index.js';

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

export async function run(interaction) {
  // Obtén los canales de texto del servidor donde se ejecutó el comando
  const textChannels = interaction.guild.channels.cache
    .filter(channel => channel.type === ChannelType.GuildText)
    .map(channel => ({
      label: channel.name, // Nombre del canal
      value: channel.id,   // ID del canal para identificarlo
    }));

  // Obtén los roles del servidor donde se ejecutó el comando
  const roles = interaction.guild.roles.cache
    .filter(role => !role.managed && role.id !== interaction.guild.id) // Excluye roles gestionados y el rol @everyone
    .map(role => ({
      label: role.name, // Nombre del rol
      value: role.id,   // ID del rol para identificarlo
    }));

  // Obtén los canales de texto del servidor donde se ejecutó el comando
  const voiceChannels = interaction.guild.channels.cache
    .filter(channel => channel.type === ChannelType.GuildVoice)
    .map(channel => ({
      label: channel.name, // Nombre del canal
      value: channel.id,   // ID del canal para identificarlo
    }));

      // Obtén los canales de texto del servidor donde se ejecutó el comando
  const categoryChannels = interaction.guild.channels.cache
  .filter(channel => channel.type === ChannelType.GuildCategory)
  .map(channel => ({
    label: channel.name, // Nombre del canal
    value: channel.id,   // ID del canal para identificarlo
  }));

  // Verifica si hay canales o roles disponibles
  if (textChannels.length === 0 && roles.length === 0 && VoiceChannels.length === 0 && Category.length === 0) {
    return channel.send({
      content: 'No hay canales ni roles disponibles en este servidor.',
    });
  }

  const GuildMember = MenuBuilder('select-guildmemberchannel', 'Selecciona un canal de texto', textChannels, config.GuildMemberAddRemoveId);
  const ListDeployment = MenuBuilder('select-listdeploymentchannel', 'Selecciona un canal de texto', textChannels, config.ListDeploymentChannel);
  const IgnoredChannelAFK = MenuBuilder('select-ignoredchannelafk', 'Selecciona un canal de texto', voiceChannels, config.IgnoredChannelId);
  const VoiceMessagesChannel = MenuBuilder('select-voicemessageschannel', 'Selecciona un canal de texto', textChannels, config.VoiceMessagesChannel);
  const Lv1Rol = MenuBuilder('select-role', 'Selecciona un rol', roles, config.adminRoleId);

  // Agrega cada menú desplegable a su propia fila
  const row1 = new ActionRowBuilder().addComponents(GuildMember);
  const row2 = new ActionRowBuilder().addComponents(ListDeployment);
  const row3 = new ActionRowBuilder().addComponents(IgnoredChannelAFK);
  const row4 = new ActionRowBuilder().addComponents(VoiceMessagesChannel);
  const row5 = new ActionRowBuilder().addComponents(Lv1Rol);

  const channel = interaction.channel;

  // Agregar texto antes de cada fila de menú
  await channel.send({
    content: `**Ajustes del servidor:**
- Elige un canal para gestionar miembros:`,
    components: [row1],
  });

  // Enviar más filas con texto
  await channel.send({
    content: `- Elige el canal de despliegue:`,
    components: [row2],
  });

  await channel.send({
    content: `- Elige un canal para ignorar cuando los usuarios estén inactivos:`,
    components: [row3],
  });

  await channel.send({
    content: `- Elige un canal de voz para asignar mensajes:`,
    components: [row4],
  });

  await channel.send({
    content: `- Elige el rol de los administradores:`,
    components: [row5],
  });
}