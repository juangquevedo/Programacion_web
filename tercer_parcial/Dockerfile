FROM node:18

WORKDIR /scr

COPY * ./

RUN npm install express dotenv jsonwebtoken express-validator pg bcrypt

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "app.js"]
