//Archivo Index.js
const { Client, Events } = require("discord.js");

//Crear nuevo cliente de discord
const client = new Client({
    intents : 3276799
});

//Primer Evento
client.on(Events.ClientReady, async () => {
    console.log(`Conectado como ${client.user.username}!`);
});
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(`-`)) return;

    const args = message.content.slice(1)

    try
{
const command = requiere(`${args}`);
command.run(mensaje);
}catch (error) {
console.log(`Error general`)}
})

//Conectar cliente
client.login("MTI1MjcwMTM5NTk2NzAyMTA3Ng.GD4Nb6.rAx_FPlZPv6hipVLW-IbxSqoV11Srg_O-opMWc");
