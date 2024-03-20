const express =require('express')
const verifyToken = require('../Middlewares/AuthMiddleware')
const { addMember, removeMember } = require('../Controllers/MemberController')
const router=express.Router()

router.post('/',verifyToken,addMember)
router.delete('/:id',verifyToken,removeMember)

module.exports= router