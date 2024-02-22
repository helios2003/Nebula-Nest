FROM ubuntu:focal

# Install all the dependencies
RUN apt-get update && apt-get install -y curl && apt-get install -y git
RUN curl --silent --location https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs && npm install -g typescript

# Set working directory
WORKDIR /home/app

COPY build.sh package*.json dist/ /home/app/
RUN npm install

# Set execute permissions to the script
RUN chmod +x build.sh

# Set the entry point
ENTRYPOINT [ "home/app/build.sh" ]
