function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function levelupmessage(message, level, GuildMember, channel) {
    const textMap = {
        1: `**GG ${GuildMember}, Felicidades, ¡tu nivel en Discord ha subido más rápido que tu nivel de habilidad en cualquier juego! Nivel ${level.toString()} desbloqueado.** 🎮`,
        2: `**GG ${GuildMember}, ya era hora, ¿eh? Nivel ${level.toString()} alcanzado. ¡Al menos aquí estás avanzando!** 🚀`,
        3: `**GG ${GuildMember}, nivel ${level.toString()} desbloqueado. Ya casi estás tan alto como tu ego. ¡Sigue así!** 😎`,
        4: `**GG ${GuildMember}, nivel ${level.toString()} alcanzado. Este es el único juego en el que subes de nivel, crack.** 🎯`,
        5: `**GG ${GuildMember}, ¡nivel ${level.toString()} alcanzado! Espero que no te sientas demasiado famoso ahora. No quiero verte en la portada de una revista.** 📸`,
        6: `**GG ${GuildMember}, nivel ${level.toString()}... Esto puede que no te sirva de mucho, pero al menos sigue siendo un logro.** 🏅`,
        7: `**GG ${GuildMember}, ya eres nivel ${level.toString()}. ¿Te sube la inteligencia o solo el ego?** 🤔`,
        8: `**GG ${GuildMember}, nivel ${level.toString()} y contando. Tal vez en el futuro puedas desbloquear el rol de "Procrastinador Profesional".** ⏳`,
        9: `**GG ${GuildMember}, nivel ${level.toString()} conseguido. ¿Este es tu mayor logro del día? No te preocupes, es solo el principio.** 🏆`,
        10: `**GG ${GuildMember}, nivel ${level.toString()} alcanzado. Si tu vida fuera un videojuego, el tutorial estaría terminando.** 🎮`,
        11: `**GG ${GuildMember}, nivel ${level.toString()} desbloqueado. Ahora oficialmente eres el "rey del Discord". ¡Corona en camino!** 👑`,
        12: `**GG ${GuildMember}, ¡nivel ${level.toString()}! Pero ahora, ¿será suficiente para subir de nivel en la vida real?** 🌱`,
        13: `**GG ${GuildMember}, nivel ${level.toString()} desbloqueado. Casi más famoso que tu meme favorito.** 🌐`,
        14: `**GG ${GuildMember}, nivel ${level.toString()} y sigues aquí, deslumbrando con tu estilo... desde la sombra.** 🕶️`,
        15: `**GG ${GuildMember}, ¡nivel ${level.toString()} alcanzado! Si esto fuera un deporte, seguro estarías en el equipo de "lo intenté".** 🏅`,
        16: `**GG ${GuildMember}, nivel ${level.toString()} logrado. La dedicación está ahí... aunque no sé si por las razones correctas.** 🤷‍♂️`,
        17: `**GG ${GuildMember}, nivel ${level.toString()} y aún sin trofeo. Pero no te preocupes, ¡el nivel 100 lo cambiará todo!** 🏆`,
        18: `**GG ${GuildMember}, ¡nivel ${level.toString()} desbloqueado! Quizás el siguiente nivel venga con un manual de instrucciones... O no.** 📚`,
        19: `**GG ${GuildMember}, nivel ${level.toString()} desbloqueado. No estoy seguro si tu clan estaría orgulloso... si tuvieras uno.** 💬`,
        20: `**GG ${GuildMember}, nivel ${level.toString()} y subiendo. ¿Qué tal si te postulas para ser el alcalde de este Discord?** 🏛️`
    };

    const randomMessage = textMap[getRandomNumber(1, 20)];

    if (channel == null) {
        message.reply(randomMessage);
    } else {
        channel.send(randomMessage);
    }
}