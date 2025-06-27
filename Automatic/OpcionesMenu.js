// Importaciones de Discord.js para crear componentes interactivos
import { ActionRowBuilder, StringSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';
// Importa la instancia del cliente del bot
import { client } from '../index.js';
// Importa función para obtener configuración del servidor
import { getGuild } from '../GuildsConfig/configs.js'

// Función helper que construye menús de selección con opciones predeterminadas
function MenuBuilder(CustomId, PlaceHolder, Options, defaultValue = null) {
  // Marca como seleccionada por defecto la opción que coincide con el valor actual
  const updatedOptions = Options.map(option => ({
      ...option,
      default: option.value === defaultValue, // Establece 'default: true' si coincide con la configuración actual
  }));

  // Construye el menú de selección de strings
  const NewMenuBuilder = new StringSelectMenuBuilder()
      .setCustomId(CustomId)        // ID único para identificar la interacción
      .setPlaceholder(PlaceHolder)  // Texto que se muestra cuando no hay selección
      .addOptions(updatedOptions.slice(0, 25)); // Discord limita a máximo 25 opciones

  return NewMenuBuilder;
}

// Función para limpiar mensajes antiguos del canal de configuración
async function ChannelClear(channel){
  try{
    // Obtiene los últimos 30 mensajes del canal
    const messages = await channel.messages.fetch({ limit: 30 });
    // Los elimina en lote para mantener el canal limpio
    await channel.bulkDelete(messages);
  }
  catch(error){
    console.log(error);
  }
}

// Función principal que crea el sistema completo de configuración del servidor
export async function OptionsMenu(guild) {
  try{
      // Obtiene la configuración actual del servidor
      const Guild = await getGuild(guild.id);
      
      // PASO 1: Crear o encontrar la categoría "Opciones"
      let categoria = guild.channels.cache.find(c => c.name === "Opciones" && c.type === ChannelType.GuildCategory);
      if (!categoria) {
          // Si no existe, crea la categoría para organizar el canal de configuración
          categoria = await guild.channels.create({
            name: "Opciones",
            type: ChannelType.GuildCategory
        });
      }
      
      // PASO 2: Crear o encontrar el canal de configuración "goodlife"
      let channel = guild.channels.cache.find(c => c.name === `goodlife`);
      if (!channel) {
        // Obtiene todos los roles con permisos de administrador del servidor
        const adminRoles = guild.roles.cache.filter(role => role.permissions.has(PermissionsBitField.Flags.Administrator));
        
        // Crea el canal privado solo para administradores
        channel = await guild.channels.create({
            name: `goodlife`,
            type: ChannelType.GuildText,
            parent: categoria.id, // Lo coloca dentro de la categoría "Opciones"
            permissionOverwrites: [
                {
                    id: guild.id, // Rol @everyone
                    deny: [PermissionsBitField.Flags.ViewChannel] // Nadie puede ver el canal por defecto
                },
                {
                    id: guild.ownerId, // Dueño del servidor
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] // Acceso completo
                },
                // Dar permisos a todos los roles de administrador
                ...adminRoles.map(role => ({
                    id: role.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }))
            ]
        });
    }

      // PASO 3: Limpiar el canal para mostrar configuración fresca
      await ChannelClear(channel);

      // PASO 4: Recopilar todos los canales de texto disponibles en el servidor
      const textChannels = guild.channels.cache
        .filter(channel => channel.isTextBased() && !channel.isThread()) // Solo canales de texto, sin hilos
        .map(channel => ({
          label: channel.name, // Nombre visible en el menú
          value: channel.id,   // ID para identificar la selección
      }));

      // Fuerza la actualización del caché de roles para obtener datos recientes
      await guild.roles.fetch();
      
      // PASO 5: Recopilar todos los roles disponibles (excluyendo roles gestionados y @everyone)
      const roles = guild.roles.cache
        .filter(role => !role.managed && role.id !== guild.id) // Excluye bots y rol @everyone
        .map(role => ({
          label: role.name, // Nombre del rol
          value: role.id,   // ID del rol
        }));

      // PASO 6: Recopilar todos los canales de voz disponibles
      const voiceChannels = guild.channels.cache
        .filter(channel => channel.type === ChannelType.GuildVoice)
        .map(channel => ({
          label: channel.name, // Nombre del canal de voz
          value: channel.id,   // ID del canal de voz
        }));

      // PASO 7: Recopilar todas las categorías disponibles
      const categoryChannels = guild.channels.cache
      .filter(channel => channel.type === ChannelType.GuildCategory)
      .map(channel => ({
        label: channel.name, // Nombre de la categoría
        value: channel.id,   // ID de la categoría
      }));

      // Verificación de seguridad: si no hay elementos disponibles, mostrar mensaje de error
      if (textChannels.length === 0 && roles.length === 0 && voiceChannels.length === 0 && categoryChannels.length === 0) {
        return channel.send({
          content: 'No hay canales ni roles disponibles en este servidor.',
        });
      }

      // PASO 8: Crear todos los menús de configuración con valores actuales preseleccionados
      
      // Configuraciones de canales
      const GuildMember = MenuBuilder('select-guildmemberchannel', 'Selecciona un canal de texto', textChannels, Guild.GuildMemberAddRemoveId);
      const ListDeployment = MenuBuilder('select-listdeploymentchannel', 'Selecciona un canal de texto', textChannels, Guild.ListDeploymentChannel);
      const IgnoredChannelAFK = MenuBuilder('select-ignoredchannelafk', 'Selecciona un canal de voz', voiceChannels, Guild.IgnoredChannelId);
      const VoiceMessagesChannel = MenuBuilder('select-voicemessageschannel', 'Selecciona un canal de texto', textChannels, Guild.VoiceMessagesChannel);
      
      // Configuraciones de roles
      const AdminRole = MenuBuilder('select-admrole', 'Selecciona un rol', roles, Guild.adminRoleId);
      const NewMemberRoleId = MenuBuilder('select-newmemberrole', 'Selecciona un rol', roles, Guild.NewmemberRoleId);
      const SecretRol1 = MenuBuilder('select-secretrol', 'Selecciona un rol', roles, Guild.SecretRolId1);
      
      // Configuraciones de categorías
      const TemporalChannelsCategory = MenuBuilder ('select-temporalchannelscategory','Selecciona una categoria',categoryChannels ,Guild.TemporalChannelsId);
      
      // Roles de nivel (1-13) - Sistema de progresión por niveles
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
      const NvRol13 = MenuBuilder('select-nvrol13', 'Selecciona un rol', roles, Guild.RolId13);
      
      // PASO 9: Crear botón para aplicar cambios
      const lastButton = new ButtonBuilder()
        .setCustomId('restart-button')
        .setLabel('Actualizar Cambios') // Texto visible del botón
        .setStyle(ButtonStyle.Primary); // Estilo azul primario

      // PASO 10: Agrupar todos los componentes en el orden de presentación
      const menus = [
        GuildMember, ListDeployment, IgnoredChannelAFK, VoiceMessagesChannel, AdminRole, TemporalChannelsCategory, 
        NewMemberRoleId, NvRol1, NvRol2, NvRol3, NvRol4, NvRol5, NvRol6, NvRol7, NvRol8, NvRol9, NvRol10, NvRol11, 
        NvRol12, NvRol13, SecretRol1, lastButton
      ];

      // Etiquetas descriptivas para cada opción de configuración
      const menulabel = [
        '👋 Canal de Bienvenidas',                    // Para mensajes de bienvenida y despedida
        '🏆 Top del servidor',                        // Para mostrar ranking de niveles
        '🕹️ Canal AFK',                              // Canal de voz ignorado para XP
        '🔔 Canal de notificaciones de eventos de voz', // Para notificar actividad de voz
        '🔧 Rol de administrador',                    // Rol con permisos de admin del bot
        '📂 Categoría para los canales de voz',      // Categoría para canales temporales
        '🆕 Rol nuevo usuario',                       // Rol automático para nuevos miembros
        '⭐ NvRol1',                                  // Roles de progresión de nivel 1-13
        '⭐ NvRol2', 
        '⭐ NvRol3', 
        '⭐ NvRol4', 
        '⭐ NvRol5', 
        '⭐ NvRol6', 
        '⭐ NvRol7', 
        '⭐ NvRol8', 
        '⭐ NvRol9', 
        '⭐ NvRol10',
        '⭐ NvRol11',        '⭐ NvRol12',
        '⭐ NvRol13',
        '🕵️‍♂️ Rol secreto',                          // Rol especial por tiempo en voz
        '🔄 Botón para actualizar la configuración al resto de usuarios' // Botón de aplicar cambios
    ];

      // PASO 11: Enviar cada menú al canal con su etiqueta correspondiente
      menus.forEach((menu, index) => {
        const menuName = `${menulabel[index]}` || `Opción ${index + 1}`; // Obtiene la etiqueta o usa un nombre genérico

        // Envía cada menú como un mensaje separado con su descripción
        channel.send({
          content: `**${menuName}:**`, // Título en negrita para cada configuración
          components: [new ActionRowBuilder().addComponents(menu)], // El menú o botón interactivo
        }).catch(error => console.log(`Error en opción ${menuName}:`, error));
      });
  }catch(error){
    // Captura cualquier error durante la creación del sistema de configuración
    console.log(`Error en la ejecucion de las opciones : ${error}`);
  }
}