// Author = Nagarjuna Yadav K.
// Mail = nagarjunayadavk@gmail.com.

var express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");
var async = require('async');
// initialize our express app
var mailReader = require("./mail-reader.js");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const asyncMiddleware = fn =>
//   (req, res, next) => {
//     Promise.resolve(fn(req, res, next))
//       .catch(next);
// };

const server = app;
//Access-Control-Allow-Origin
server.use((req, resp, next) => {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    resp.set('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization');
    next();// it require////
});

//to Accept all requests of OPTIONS
app.options('/*', (req, resp) => {
    resp.end();
})


server.get('/readMails', async (req, res, next) =>{
    let mail = req.headers['mail'];
    let pass = req.headers['secret']
    let order_details = await mailReader.mailConnect(mail,pass); 
    // mailReader.mailConnect(mail,pass);
    res.json( {"sucess":'sucessfully Triggred','order_details': order_details});
    // let order_details = [];
    // order_details =mailReader.mailConnect(mail,pass);
    // if(order_details.length > 0){
    //    resp.json( {"sucess":'sucessfully Triggred', "order_details": order_details});
    // }
    
});

var port = process.env.PORT || 900;
server.listen(port, () => {
    console.log("REST Endpoint Server at port" + port);
});



