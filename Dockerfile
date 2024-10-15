# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy everything from the host machine into the container
COPY . .

# Install dependencies for both repositories
RUN cd solrate_exp && npm install && \
    cd ../SolRate_ZKP && npm install

# Expose the port your server will run on (adjust if necessary)
EXPOSE 3001

# Set the working directory to the repo you want to run
WORKDIR /app/solrate_exp

# Start the server (update if your start command is different)
CMD ["npm", "run", "server.js"]
