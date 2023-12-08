import Express from 'express';
const app = Express();

app.get('/', (req, res) => {
    res.send('root')
})


app.listen(8080, (req, res) => {
    console.log('Server is now open');
})