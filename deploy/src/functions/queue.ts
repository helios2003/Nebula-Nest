import { connect } from 'amqplib';
import dotenv from 'dotenv';
import fs from 'fs';

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
            fs.appendFile(`../logs/${message.content.toString()}.log`, `✔️ Starting the deployment process\n`, (err) => {
                if (err) throw err;
            });
            channel.ack(message);
            return message.content.toString();
        } else {
            // send this over to the client
            console.log(`No messages in Queue "${queueName}"`);
        }
        
        await channel.close();
        await connection.close();
    } catch (err) {
        console.error(err);
        throw new Error;
    }
}
