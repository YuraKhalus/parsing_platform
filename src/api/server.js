const express = require('express');
const cors = require('express');
const productController = require('./controllers/productController');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/products', productController.addProduct);
// app.get('/api/products/:telegramId', productController.getUserProducts);
// app.delete('/api/products', productController.removeProduct)

const startServer = (port) => {
   app.listen( port, () => console.log(`API strted on addres localhost:${port}`))
}

module.exports = {startServer };