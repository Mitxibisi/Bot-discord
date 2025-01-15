import { reset } from '../database.js';

export async function run(message){
    await reset(message.author.id);
}