const { create, Client } = require('@wppconnect-team/wppconnect');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar cors

const app = express();
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(bodyParser.json());

create('sessionName').then((client) => start(client));

function start(client) {
    // Escuchar los Mensajes.
    client.onMessage((message) => {
        if (message.body === 'Hola') {
          client
            .sendText(message.from, 'Hola este es un buen bot?')
            .then((result) => {
              console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
              console.error('Error when sending: ', erro); //return object error
            });
        }
      });
    // Ruta para enviar mensajes con botones
    app.post('/enviabuttons', async (req, res) => {
        const { message, number, buttons } = req.body;

        // Validar los parámetros
        if (!message || !number) {
            return res.status(400).send('El mensaje y el número son requeridos.');
        }

        try {
            // Crear el mensaje con botones
            const buttonMessage = {
                useTemplateButtons: true,
                buttons: buttons || [],
                title: 'Title text',
                footer: 'Selecciona una opción:'
            };

            // Enviar mensaje a un número o grupo
            await client.sendText(number, message, buttonMessage);
            res.status(200).send('Mensaje con botones enviado exitosamente');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error al enviar el mensaje con botones');
        }
    });

    // Ruta para enviar mensajes de texto simples
    app.post('/send-message', async (req, res) => {
        const { message, number } = req.body;

        // Validar los parámetros
        if (!message || !number) {
            return res.status(400).send('El mensaje y el número son requeridos.');
        }

        try {
            // Enviar mensaje a un número o grupo
            await client.sendText(number, message);
            res.status(200).send('Mensaje enviado exitosamente');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error al enviar el mensaje');
        }
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}