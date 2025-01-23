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
});

// Manejar la interacción del botón
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return; // Verificar que es un botón
  if (interaction.customId === 'actualizar') {
    // Actualizar las variables aquí
    variables.data = 'Nueva información actualizada';

    // Responder a la interacción y actualizar el mensaje
    await interaction.update({
      content: `${variables.data}`,
      components: [new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('actualizar').setLabel('Actualizar').setStyle(ButtonStyle.Primary)
      )],
    });
  }
}