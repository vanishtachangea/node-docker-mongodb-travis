const express = require('express');
const bodyparser = require('body-parser'); //middleware parsers first in an API so every request gets parsed. 
const mongoClient = require('mongodb').mongoClient;

const dbName = process.env.NODE_ENV === 'dev'? 'database-test':'database';
const url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${dbName}:27017?autoMechanism=SCRAM-SHA-1&authSource=admin`
const options ={
    useNewUrlParser:true,
    reconnectTries:60,
    reconnectInterval: 1000
}
const routes = require('./routes/routes.js');
const port = process.env.PORT || 80;
const app = express();
const http = require('http').Server(app);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use('/api',routes);
app.use((req,res)=>{
    res.status(404)
})

mongoClient.connect(url, options, (err,database)=>{
    if(err){
        console.log(`Mongodb Connection Error: ${err}:${err.stack}`);
        process.exit(1);
    }
    app.locals.db = database.db('api')
    http.listen(port,()=>{
        console.log('Listening on port '+port);
        app.emit('APP_STARTED');
    })
})
module.exports = app;