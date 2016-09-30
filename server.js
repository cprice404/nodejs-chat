'use strict';

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'html', 'index.html');

const server = express()
        .use((req, res) => res.sendFile(INDEX) )
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));
