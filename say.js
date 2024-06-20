module.exports = { 
description: 'Repite los argumentos dados',
run: async ( mensaje) => {
const args = message.content.split(``).slice(1).join('');

if(args.length < 1) return message.reply(`Error`)
message.reply(args);
}