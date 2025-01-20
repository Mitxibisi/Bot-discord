function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function levelupmessage(message, level, GuildMember, channel) {
    const textMap = {
        1: `**GG ${GuildMember}, Felicidades eres tan puto retrasado que en vez de subir al nivel ${level.toString()} en un juego lo subes en discord paleto de playa**`,
        2: `**GG ${GuildMember}, ya era hora de que subieras al nivel ${level.toString()}, al menos en algo estás progresando, aunque sea aquí.**`,
        3: `**GG ${GuildMember}, nivel ${level.toString()} desbloqueado. Ahora intenta no caerte subiendo escaleras, crack.**`,
        4: `**GG ${GuildMember}, nivel ${level.toString()} y seguimos en Discord. Quizá algún día lo hagas en la vida real.**`,
        5: `**GG ${GuildMember}, ¡nivel ${level.toString()} alcanzado! Cuidado, no se te vaya a subir la fama a la cabeza.**`,
        6: `**GG ${GuildMember}, nivel ${level.toString()}... A ver si al menos te sirve para algo, aunque sea de adorno.**`,
        7: `**GG ${GuildMember}, ya estás en nivel ${level.toString()}. Una pena que el progreso no se transfiera al intelecto.**`,
        8: `**GG ${GuildMember}, nivel ${level.toString()} y contando. Tal vez ya puedas desbloquear el rol de "noob profesional".**`,
        9: `**GG ${GuildMember}, ¡nivel ${level.toString()} conseguido! ¿Es este tu logro más grande del año?**`,
        10: `**GG ${GuildMember}, nivel ${level.toString()} alcanzado. Si tu vida fuera un videojuego, estarías listo para el tutorial.**`,
        11: `**GG ${GuildMember}, nivel ${level.toString()}. Ahora oficialmente eres el "rey del salón" en Discord.**`,
        12: `**GG ${GuildMember}, ¡nivel ${level.toString()}! Veamos si este ritmo lo mantienes fuera de la pantalla.**`,
        13: `**GG ${GuildMember}, nivel ${level.toString()} desbloqueado. Ya casi eres más famoso que tu meme favorito.**`,
        14: `**GG ${GuildMember}, nivel ${level.toString()} y sigues aquí. Es admirable cómo evitas la luz del sol con tanto estilo.**`,
        15: `**GG ${GuildMember}, ¡nivel ${level.toString()} alcanzado! Si esto fuera un deporte, tendrías medalla de cartón.**`,
        16: `**GG ${GuildMember}, nivel ${level.toString()} logrado. La dedicación a esta causa sigue siendo cuestionable, pero impresionante.**`,
        17: `**GG ${GuildMember}, nivel ${level.toString()} y aún no te han dado un trofeo. A lo mejor en el nivel 100, quién sabe.**`,
        18: `**GG ${GuildMember}, ¡nivel ${level.toString()} desbloqueado! Tal vez el próximo nivel venga con un manual de instrucciones.**`,
        19: `**GG ${GuildMember}, nivel ${level.toString()}. Seguro que los de tu clan estarán orgullosos... si tuvieras uno.**`,
        20: `**GG ${GuildMember}, nivel ${level.toString()} y subiendo. ¿Has considerado postularte para alcalde de este Discord?**`
    };

    if (channel == null){
        message.reply(textMap[getRandomNumber(1,20)]);
    }else{
        channel.send(textMap[getRandomNumber(1,20)]);
    }
}