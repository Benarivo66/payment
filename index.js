const express = require('express');
const {dbConnect} = require('db-methods');
const { pay, countVote } = require('./payment');


const app = express();

require('dotenv').config();

dbConnect();

const port = process.env.PORT || 3003;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/paystack/pay', pay);
app.get('/paystack/callback', countVote);

app.listen(port, () => {
    console.log(`port running on port ${port}`);
});