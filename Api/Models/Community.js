const mongoose =require('mongoose')
const communitySchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true 
    },
    name: {
      type: String,
      maxlength: 128
    },
    slug: {
      type: String,
      maxlength: 255,
      unique: true
    },
    owner: {
      type: String, // Assuming _id of User is a string
      ref: 'User'
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  });

  const Community = mongoose.model('Community', communitySchema);
  module.exports= Community