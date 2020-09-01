#Importing Node.js image current
# Each instructions in a dockerfile is a separate layer
# Docker tries to cache layers
FROM node:current

WORKDIR /app

#Copies both package.json and package-lock.json so that it can be cached and doesnt need to always be reinstalled
# COPY src dest
COPY package*.json ./

# Runs a command
# Also known as Shell Form.
RUN npm install

#Copy all files from the current directory with account to .dockerignore (i.e. node_modules)
COPY . .

# Set the environment port as 8080
ENV PORT=3000

# Container port is exposed
EXPOSE 8080

#Exec Form unlike a shell session where it doesnt run
#Only one of these per dockerfile
CMD ["npm", "start"]