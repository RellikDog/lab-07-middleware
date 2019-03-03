'use strict';

const express = require('express');
const errorMW = require('./error');
const app = express();

const PORT = process.env.PORT || 8080;

app.use((request, response, next) => {
    request.requestTime = Date();//https://stackoverflow.com/questions/37118070/adding-property-to-the-request-using-node-and-express
    next();
});

app.use((request, response, next) => {
    console.log(request.path, request.method, request.requestTime);
    next();
});
const randoNum = (request, response, next) => {
    let num = Math.random();
    console.log(`${num}`);
    next();
};
const raiseError = (request, response, next) => {
    next();
};
const randoBNum = (num) => {
    return function(request, response, next) {
        request.number = num * num;
        next();
    };
};
app.get('/a', (req,res) => {
    res.status(200).send('Route A');
});

app.get('/b', randoBNum(5), (request,response) => {
    response.status(200).send(`${request.number}`);
});

app.get('/c', randoNum,(req,res) => {
    res.status(200).send('Route C');
});

app.get('/d', (req,res) => {
    res.status(200).send('Route D');
});


//404handler
const notFound = (request, response, next) => {
    console.log('404 MiddleWare');
    next();
};
app.get('/*', notFound, (request, response)=>{
    response.status(404).send('Route Not Found');
});
//error handling mw call
app.use(function (error, request, response, next) {
    console.error(error.stack);
    response.status(500).send('Error MiddleWare');
    next();
});
//listener
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
