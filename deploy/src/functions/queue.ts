import { connect } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const rabbitmqUrl = process.env.QUEUE_URL ?? "";
const queueName = 'id-queue';

export async function popFromQueue() {
    try {
        const connection = await connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        const message = await channel.get(queueName);
        if (message) {
            console.log(`Received "${message.content.toString()}" from Queue "${queueName}"`);
            channel.ack(message);
            return message.content.toString();
        } else {
            console.log(`No messages in Queue "${queueName}"`);
        }
        
        await channel.close();
        await connection.close();
    } catch (err) {
        console.error(err);
        throw new Error;
    }
}
