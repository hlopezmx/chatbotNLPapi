const express = require('express');
const app = express();

var nlp = require('./helpers/nlp.js');

var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.send('hello world');
});

function notifyUnavailability(res) {
    res.status(503).send('{"Error":"Classifier is unavailable at the moment."}')
}

app.post('/message', (req, res) => {
    if (!nlp.classifierOnline()) {
        notifyUnavailability(res)
    }

    if (!req.body.message || typeof req.body.message != "string") {
        res.status(400).send("400 Bad Request")
    }


    var message = req.body.message;

    var [intent, response] = nlp.getResponse(message, intent);
    if (!intent) {
        notifyUnavailability(res)
    } else {
        res.send('{' +
            '"intent":"' + intent + '",' +
            '"response":"' + response + '"' +
            '}'
        );
    }
});


app.get('/train', (req, res) => {
    nlp.train('./data/training_small.txt');
    res.send('training complete.');
});

app.listen(3000, function () {
    console.log('listening on 3000');
});


