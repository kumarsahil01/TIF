const express =require('express')
const router=express.Router()
const {signup, signin, me}=require('../Controllers/AuthController')

router.post('/signup',signup);
router.post('/signin',signin);
router.get('/me',me)

module.exports= router