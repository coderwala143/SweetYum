const http = require("http");
const app = require("./app");

const port = 3000

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port `,process.env.PORT);
})