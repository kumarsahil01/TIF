const mongoose =require('mongoose')

const userSchema=new mongoose.Schema(
{
    _id: {
        type: String,
        required: true 
      },
      name: {
        type: String,
        maxlength: 64,
        default: null
      },
      email: {
        type: String,
        maxlength: 128,
        unique: true
      },
      password: {
        type: String,
        maxlength: 64
      },
      created_at: {
        type: Date,
        default: Date.now
      }
})

const User =mongoose.model('User',userSchema)
module.exports= User