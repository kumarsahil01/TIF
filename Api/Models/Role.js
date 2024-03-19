const mongoose=require('mongoose')
const roleSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true // Assuming you want to enforce the presence of _id
    },
    name: {
      type: String,
      maxlength: 64,
      unique: true
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

  const Role = mongoose.model('Role', roleSchema);
  module.exports= Role