(async() => {
  try {
    if (process.env.NODE_ENV !== 'production') {
       require('dotenv').config()
    }

    require('module-alias/register')
    const express = require('express');
    const requestIp = require('request-ip');
    const cors = require('cors');
    const fileUpload = require('express-fileupload');
    
    
    const routes = require('~/routes');
    const { sequelize } = require('~/models');
    const app = express();
    
    app.use(express.json());
    app.use(requestIp.mw())
    app.use(fileUpload())
    app.use(cors());
    app.use(express.static('static'))
    

    // condition here
    if (true) {
      await sequelize.sync()
      console.log('Database sync complete.')
    }

    
    routes(app)
    const server = require("http").createServer(app);
    const Websocket = require("ws");
    const wss = new Websocket.Server({ server: server, perMessageDeflate: false });
    
    wss.on('connection', (ws) => {
      
      ws.on('message', (message) => {
        try {
          const broadcastMessage = JSON.parse(message);
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === Websocket.OPEN) {
              client.send(JSON.stringify(broadcastMessage));
            }
          });
        } catch (error) {
          console.log(error)
        }
      })
    });

    server.listen(process.env.SERVER_PORT, () => {
      console.log(`Application is listening on port ${process.env.SERVER_PORT}`)

    });
  } catch (err) {
    console.log(err);
  }
}
)();
