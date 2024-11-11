const { create, Client } = require('@wppconnect-team/wppconnect');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

create('sessionName').then((client) => start(client));

function start(client) {
    app.post('/send-message', (req, res) => {
        const { message, groupId, number } = req.body;

        if (!message) {
            return res.status(400).send('Message is required');
        }

        if (groupId) {
            // Enviar mensaje a un grupo
            client.sendText(groupId, message)
                .then(response => {
                    res.status(200).send('Message sent to group successfully');
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Failed to send message to group');
                });
        } else if (number) {
            // Enviar mensaje a un número específico
            client.sendText(number + '@c.us', message)
                .then(response => {
                    res.status(200).send('Message sent successfully');
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Failed to send message');
                });
        } else {
            return res.status(400).send('Either number or groupId is required');
        }
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}