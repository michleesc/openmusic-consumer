require('dotenv').config();
const amqp = require('amqplib');
const SongsService = require('./SongsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
    const songsService = new SongsService();
    const mailSender = new MailSender();
    const listener = new Listener(songsService, mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlists', {
        durable: true,
    });

    channel.consume('export:playlists', listener.listen, { noAck: true });

    console.log(`Consumer berjalan pada ${process.env.RABBITMQ_SERVER}`);
};

init();