FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .

RUN chmod +x entrypoint.sh
ENTRYPOINT ["/bin/sh", "-c", "./entrypoint.sh"]
