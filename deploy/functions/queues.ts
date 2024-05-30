import { S3, SQS } from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })
const s3 = new S3({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
})

const sqs = new SQS()
const bucketName = process.env.BUCKET_NAME ?? ''
const queueUrl = process.env.QUEUE_URL ?? ''

// create the queue, used when the upload process gets initialised
export async function createQueue() {
    const createParams = {
        QueueName: "nebula-nest",
        Attributes: {
            DelaySeconds: "10",
            MessageRetentionPeriod: "86400",
        }
    }
    await sqs.createQueue(createParams).promise()
}

/*
the user who started their deployment must be serviced first 
hence sort by time and return the ids
*/
export async function sortProjectbyTime() {
    try {
        const params = { Bucket: bucketName }
        const data = await s3.listObjectsV2(params).promise()
        const files = data.Contents?.map((file: any) => {
            return {
                Key: file.Key,
                LastModified: file.LastModified
            }
        })
        files?.sort((a, b) => {
            let timeDiff = new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime()  
            return timeDiff
        })
        const fileIds = files?.map((file: any) => file.Key)
        return fileIds
    } catch(err) {
        console.error(err)
    }
}

// Put these projectIds into the SQS queue
export async function putIdtoQueue() {
    try {
        const projectIds = await sortProjectbyTime()
        for (const projectId in projectIds) {
            const params = {
                MessageBody: projectId,
                QueueUrl: process.env.QUEUE_URL ?? "",
                DelaySeconds: 0
            }
            sqs.sendMessage(params, function (err, data) {
                if (err) {
                  console.log("Error", err);
                } else {
                  console.log("Success", data.MessageId);
                }
            })
        }
    } catch(err) {
        console.error(err)
    }
}

// Obtain the project based on their id from the S3
async function getProjectFromS3(projectId: string) {
    try {
        const params = {
            Bucket: bucketName,
            Key: projectId
        }
        const data = await s3.getObject(params).promise()
        return data.Body?.toString('utf-8')
    } catch(err) {
        console.error(err)
        throw err
    }
}

// Get the actual project from S3 and send it to the deployment service
export async function getProject(projectId: string) {
    try {
        if (!projectId) {
            console.error("projectId is undefined")
            return null
        }

        const getParams = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 600 
        }
        
        const data = await sqs.receiveMessage(getParams).promise()
        
        if (data.Messages && data.Messages.length > 0) {
            const project = await getProjectFromS3(projectId)
            if (!data.Messages[0].ReceiptHandle) {
                throw Error
            }
            const deleteParams = {
                QueueUrl: queueUrl,
                ReceiptHandle: data.Messages[0].ReceiptHandle
            };

            sqs.deleteMessage(deleteParams, function (err, data) {
                if (err) {
                  console.log("Delete Error", err);
                } else {
                  console.log("Message Deleted", data)
                }
            })
            return project
        } else {
            return null;
        }
    } catch(err) {
        console.error(err);
        throw err;
    }
}
