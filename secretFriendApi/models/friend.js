var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FriendSchema = new Schema({
  id: {type: String, required: true, max: 100},
  name: {type: String, required: true, max: 100},
  idFriend: {type: String, max: 100},
  image: {type: String},
});

// Export the model
var friend = mongoose.model('Friend', FriendSchema);

 module.exports = {
   Friend : friend
 }