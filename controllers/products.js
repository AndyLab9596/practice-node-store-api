const Product = require('../models/product');

const getAllProducts = async (req, res) => {
    const { featured } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }

    let result = Product.find(queryObject)
    // Chaining method

    //
    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = { getAllProducts }