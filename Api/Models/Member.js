const mongoose =require('mongoose')

const memberSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true // Assuming you want to enforce the presence of _id
    },
    community: {
      type: String, // Assuming _id of Community is a string
      ref: 'Community'
    },
    user: {
      type: String, // Assuming _id of User is a string
      ref: 'User'
    },
    role: {
      type: String, // Assuming _id of Role is a string
      ref: 'Role'
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  });

const Member = mongoose.model('Member', memberSchema);
module.exports= Member
