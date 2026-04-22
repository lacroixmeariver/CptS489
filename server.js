const app = require('./app');
const { createServer } = require('http');
const { initSocket } = require('./socket');

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(3000, () => console.log("Server running on port 3000"));