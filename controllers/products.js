const Product = require('../models/product');

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }

    if (company) {
        queryObject.company = company
    }

    if (name) {
        // {$regex: name, options: 'i'} -> find whatever name which contains entered letters and $options: 'i' is case insensitivity
        queryObject.name = { $regex: name, $options: 'i' }
    }

    if (numericFilters) {
        // example input: price>40,rating>=4
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        };
        const regGex = /\b(<|>|>=|<=|=)\b/g;
        let filters = numericFilters.replace(regGex, (match) => `-${operatorMap[match]}-`);
        // transform example input: price-$gt-40,rating-$gte-4
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
                // price: {$gte: 40}
            }
        })
    }

    let result = Product.find(queryObject)
    // Chaining method
    // Sorting
    if (sort) {
        // example input: sort=name,-price -> output: sort('name price')
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }
    // Selecting
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList)
    }
    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = { getAllProducts }