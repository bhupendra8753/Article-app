const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const http = require("http");
const debug = require("debug")("node-angular");


//load routes
const articles = require('./routes/articles.route');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

//allow static files to access
app.use("/images", express.static(path.join("images")));
//CORS setting 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH,PUT,DELETE, OPTIONS"
    );
    next();
  });

// Configuring the database
const dbConfig = require('./config/appConfig');

mongoose.Promise = global.Promise

mongoose.connect(dbConfig.url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology : true });

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...')
    process.exit()
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database")
});

app.use('/api/v1/articles',articles);

// define default route
app.get('/', function(req, res){
    res.send('Working...');
})

const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  };
  
  const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
  };
  
  const port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);
  
  const server = http.createServer(app);
  server.on("error", onError);
  server.on("listening", onListening);
  server.listen(port);

module.exports = app;
