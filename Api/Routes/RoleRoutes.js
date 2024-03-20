const express =require('express')
const verifyToken = require('../Middlewares/AuthMiddleware')
const { createRole, getAllRoles } = require('../Controllers/RoleController')
const router=express.Router()

router.post('/',verifyToken,createRole)
router.get('/',verifyToken,getAllRoles)

module.exports= router