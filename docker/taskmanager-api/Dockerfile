FROM node:20.9.0-alpine 

WORKDIR /app

# Install build dependencies for sharp
RUN apk add --no-cache \
    g++ \
    gcc \
    libgcc \
    libstdc++ \
    linux-headers \
    make \
    python3

# Set the Python environment variable for node-gyp
ENV PYTHON=python3

COPY package*.json ./

RUN npm install --omit=dev

COPY ./src ./src

EXPOSE 3000

CMD ["node", "./src/index.js"]