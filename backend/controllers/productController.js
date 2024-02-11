const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//create product by admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id
  const product = await Product.create(req.body);
  console.log(Product)
  res.status(201).json({
    success: true,
    product,
  });
});

//Get All products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerpage = 5;
  const productCount = await Product.countDocuments()
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

//Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
//Update product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete a Product

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

//Create review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
   
  const {rating, comment, productId} = req.body
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(productId)
  console.log("product.reviews",product.reviews,"req.user._id",req.user._id)
  const isReviewed = product.reviews.find(rev => rev.user.toString()=== req.user._id.toString())
    //If he has already given a review via that id
    //Bug is there if a user wants to give review second time
  if(isReviewed){
    product.reviews.forEach((review) => {
      if(review.user.toString() === req.user._id.toString())
        (review.rating = rating), (review.comment = comment)
    });
  }else{
    product.reviews.push(review)
    product.numfReviews = product.reviews.length
  }
  //Finding the average rating of that product
  let avg=0
 product.reviews.forEach(review=>{
    avg += review.rating
  })
  product.ratings = avg/product.reviews.length

  await product.save({ validateBeforeSave: false})
  res.status(200).json({
    success: true
  })
})

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});