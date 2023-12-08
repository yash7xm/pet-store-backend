import Express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config({
    path: '.env'
})

mongoose.connect(process.env.MONGO_PROD_URL)
    .then(() => console.log('connected db'))
    .catch(err => console.log(err));

const app = Express();


app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('root')
})


app.listen(8080, (req, res) => {
    console.log('Server is now open');
})