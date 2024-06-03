import { connect } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const rabbitmqUrl = process.env.QUEUE_URL ?? "";
const queueName = 'id-queue';

export async function createQueue(options = { durable: true }) {
    try {
        const connection = await connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, options);
        console.log(`Queue ${queueName} created successfully`);

        await connection.close();
    } catch (err) {
        console.error(err);
        throw new Error('Error creating queue');
    }
}

export async function pushToQueue(message: string, options = { persistent: true }) {
    try {
        const connection = await connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        channel.sendToQueue(queueName, Buffer.from(message), options);
        console.log(`Sent "${message}" to Queue "${queueName}"`);

        await channel.close();
        await connection.close();
    } catch(err) {
        console.error(err);
        throw new Error;
    }
}



