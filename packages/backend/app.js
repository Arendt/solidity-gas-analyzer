require('dotenv').config()

const express = require('express')
const cors = require('cors');
const classTransformer = require ('class-transformer');

const analyzer = require('./index');

const app = express();
const path = require('path');
const port = process.env.WEBSERVER_PORT;

app.use(cors());
app.use(express.static(path.join(__dirname, process.env.WEBSERVER_FOLDER)));

/**
 * GUI files
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.WEBSERVER_INDEX));
});

/**
 * API endpoint
 */
app.get('/api/analyze/:txHash', async function (req, res) {
    console.log(req.params);

    let txHash = req.params.txHash;
    let tx = await analyzer.analyze(txHash);

    res.json(classTransformer.instanceToPlain(tx));
});

/**
 * Start the webserver
 */
app.listen(port, () => {
    console.log(`Webserver started on http://127.0.0.1:${port}`);
});