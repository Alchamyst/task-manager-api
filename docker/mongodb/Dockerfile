FROM mongo:latest

ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=adminPassword
ENV MONGO_INITDB_DATABASE=task-manager-api

# Copy the MongoDB initialization script into the container
COPY ./docker/mongodb/init-mongo.js /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017