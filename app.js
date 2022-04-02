const express = require('express');
require('dotenv').config();
const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error');
const notFound = require('./middleware/not-found');
const productsRouter = require('./routes/products');

const app = express();
app.use(express.json());

app.use('/api/v1/products', productsRouter)


app.use(errorHandlerMiddleware)
app.use(notFound)

const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })

    } catch (err) {
        console.log(err)
    }
}

start()