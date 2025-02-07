# Bot de Discord

Este es un bot de Discord que ofrece diversas funciones para la gestión del servidor, roles, interacción con los usuarios y más. Está diseñado para ser fácil de usar y altamente configurable. Este repositorio contiene el código fuente del bot y las instrucciones para su configuración.

## Características

- **Gestión de servidores y roles**: El bot permite gestionar servidores de Discord, asignar roles automáticamente y realizar configuraciones a través de un menú interactivo.
- **Sistema de niveles**: Los usuarios ganan experiencia y suben de nivel, con recompensas basadas en su actividad en el servidor.
- **Moderación**: El bot puede eliminar mensajes inapropiados y gestionar roles para moderadores.
- **Canales temporales**: Los canales de voz se eliminan automáticamente cuando están vacíos durante 30 segundos.
- **Sistema de tickets**: Los usuarios pueden crear tickets para soporte, los cuales pueden ser gestionados por los administradores del servidor.
- **Bienvenidas y despedidas personalizadas**: Los nuevos miembros del servidor son recibidos con un mensaje personalizado y una imagen.
- **Comandos de administración**: Incluye comandos para ver perfiles de usuario, gestionar configuraciones y añadir o eliminar experiencia.

## Estructura del Proyecto

1. **Rama `main`**: Contiene el código estable y la versión principal del bot.
2. **Rama `V1.0`**: Primera versión funcional del bot. Puedes usar esta rama como base si necesitas volver a una versión anterior.
3. **Rama `dev`**: Aquí se realizan las pruebas y el desarrollo de nuevas características. No se recomienda para producción.

## Requisitos

- Node.js (versión 16 o superior)
- Discord.js (v14 o superior)
- SQLite (base de datos)
- Un servidor de Discord para agregar el bot

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/bot-discord.git

2. Accede al directorio del proyecto:

cd bot-discord


3. Instala las dependencias necesarias:

npm install


4. Configura el bot con los detalles de tu servidor de Discord. Asegúrate de tener el archivo config.json con el token de tu bot y otros parámetros de configuración.



Uso

Para ejecutar el bot, usa el siguiente comando:

node index.js

Asegúrate de que el archivo config.json esté correctamente configurado con el token de tu bot y la información necesaria.

Contribuciones

Si deseas contribuir a este proyecto, por favor crea un pull request o abre un issue con tus sugerencias.

Licencia

Este proyecto está licenciado bajo la CLUFs License.