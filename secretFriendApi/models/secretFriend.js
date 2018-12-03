var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {type: String, required: true, max: 100},
    price: {type: String, required: true},
    category: {type: String, required: true, max: 100},
    supermarket: {type: String, required: true, max:100},
    brand: {type: String, required: true, max:100},
    image: {type: String, required: true, max:100},
});

var ShopListSchema = new Schema({
  name: {type: String, required: true, max: 100},
  products: [ProductSchema] 
});

var SuperMarketSchema = new Schema({
  id: {type: String, required: true, max: 100},
  name: {type: String, required: true, max: 100},
  image: {type: String, required: true, max:100},
});


// Export the model
var product = mongoose.model('Product', ProductSchema);
var shop_list = mongoose.model('ShopList', ShopListSchema);
var super_market = mongoose.model('SuperMarket', SuperMarketSchema);

 module.exports = {
   Product : product,
   ShopList: shop_list,
   SuperMarket: super_market
 }