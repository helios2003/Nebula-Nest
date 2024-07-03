# System Design of the Project
![System Design](./sys-design.png)
## Upload Server
- The user enters the project's GitHub URL and then the necessary files get downloaded from GitHub.
- Check the size of the repository being downloaded and if it is more than 1GB then it cannot be downloaded.
- A unique ``id`` of the project is generated which helps user keep track of their project throughout the entire process.
- After the successful download all the different static and dynamic files will be uploaded to AWS S3 and deleted from the server.
- After a project's contents are put in S3, the projects' ``id`` is pushed into a queue. This is the publisher in the queue.

## Deployment Server
- Deployment is an expensive operation as here all the frontend code is converted to native HTML, CSS and JS which can be understood by the browser.
- Hence whenever deployment server is free, it pops the ``id`` from the queue and builds the project. This acts as the subscriber in the queue. Hence queue acts as a shock absorber and doesn't overload the deployment server.
- Building process is run inside a docker container for security reasons. Server can spin containers up and down at it's will.
- The converted files are sent back to S3 for storage.

## Request-Response Webhook
- After deployment is complete, the server retrieves the files and static assets from S3 and sends it to client.

## Health status server
- This server is polled by the client at regular intervals to check if the project is building or not.
- This service essentially reads from the log file and notifies the client when the project is ready to be viewed.

## PotgreSQL
- Chose Postgres because this is a project with lesser reads and more writes and Postgres is good at this functionality.
- Will store the user's project configuration details like the output folder, the installation command, the build command etc.
- This will help the user view the project logs for the specific ``id`` in the future as well.

## Log File
- This will contain logs of the project's build and deployment process.
- And it will get uploaded to the database as well.
