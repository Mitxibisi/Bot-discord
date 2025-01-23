let variables = { // Variables que quieres actualizar
  data: 'Información inicial'
};

export async function run(){
    // Crear el botón de actualización
    const updateButton = new ButtonBuilder()
      .setCustomId('actualizar')
      .setLabel('Actualizar')
      .setStyle(ButtonStyle.Primary);

    // Crear una fila de botones
    const row = new ActionRowBuilder().addComponents(updateButton);

    // Enviar el mensaje con la información y el botón
    await message.channel.send({
      content: `${variables.data}`,
      components: [row],
    });
  }