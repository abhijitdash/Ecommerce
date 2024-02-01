const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
//create product by admin
exports.createProduct = catchAsyncErrors(async (req, res, next) =>  {

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

//Get All products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const products = await Product.find()
    res.status(200).json({
        success: true,
        products
    })
})

//Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})
//Update product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })

})

//Delete a Product

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"

    })
}