Bot de Discord

Este bot está diseñado para gestionar diversos aspectos de un servidor de Discord, como la administración de roles, niveles, moderación, y más. El bot se configura y administra a través de comandos personalizados y menús interactivos.

Funcionalidades

1. Gestión del Servidor y Roles: El bot permite gestionar roles y asignar permisos a los usuarios basados en su nivel.


2. Sistema de Niveles: Los usuarios ganan experiencia en función de su actividad en el servidor (tanto en texto como en voz). Al subir de nivel, se asignan roles automáticamente.


3. Moderación: El bot incluye comandos para eliminar mensajes y gestionar el comportamiento de los miembros.


4. Canales Temporales de Voz: Los canales de voz pueden ser creados y eliminados automáticamente según la actividad de los usuarios.


5. Bienvenidas y Despedidas Personalizadas: Al unirse o salir un miembro, se envía un mensaje con una imagen personalizada y un texto de bienvenida o despedida.


6. Perfil de Usuario: Los usuarios pueden ver su nivel, roles y otros detalles a través de un comando que muestra su perfil.


7. Top 100 Usuarios: El bot mantiene un ranking de los 10 usuarios con más experiencia en el servidor.


8. Sistema de Tickets: Los usuarios pueden crear un ticket para recibir soporte o hacer preguntas. El sistema de tickets permite un historial y estado de cada uno.


9. Comandos de Administración: El bot ofrece comandos para moderadores y administradores, como la capacidad de reiniciar o resetear la base de datos.


10. Configuración Personalizada: Los administradores pueden personalizar la configuración del servidor, como los canales de bienvenida, roles y más, a través de un menú interactivo.




---

Instalación

1. Clona este repositorio en tu máquina local.


2. Asegúrate de tener Node.js y npm instalados. Si no los tienes, puedes descargarlos desde aquí.


3. Ejecuta el siguiente comando para instalar las dependencias:

npm install


4. Crea un archivo configurado.js en la raíz del proyecto y agrega tu token de Discord y otras variables necesarias:
{
  "TOKEN":"your_token_here",
}

5. Ejecuta el bot con el siguiente comando:

node index.js




---

Cómo Funciona

1. Comandos de Administración: Los administradores pueden acceder a comandos para modificar la configuración del bot y gestionar usuarios.


2. Sistema de Niveles: Los usuarios ganan experiencia a través de su actividad, y cuando suben de nivel, el bot asigna nuevos roles automáticamente.


3. Gestión de Canales: El bot puede gestionar canales de voz, eliminando aquellos que no tengan usuarios conectados durante un tiempo determinado.




---

Contribuciones

Este proyecto está diseñado para ser utilizado en servidores de Discord privados. Actualmente, no está disponible para el público, pero puedes clonar este repositorio y adaptarlo a tus necesidades.


---

Licencia

Este proyecto no tiene licencia específica por el momento. Si decides hacer modificaciones, asegúrate de seguir las mejores prácticas de código abierto y respetar los términos de servicio de Discord