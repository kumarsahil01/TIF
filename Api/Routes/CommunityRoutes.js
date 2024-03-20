const express =require('express')
const router=express.Router()
const verifyToken = require('../Middlewares/AuthMiddleware')
const { createCommunity, getCommunities, getAllMembers, getOwnedCommunities, getJoinedCommunities } = require('../Controllers/CommunityController')

router.post('/',verifyToken,createCommunity)
router.get('/',verifyToken,getCommunities)
router.get('/:id/members',verifyToken,getAllMembers)
router.get('/me/owner',verifyToken,getOwnedCommunities)
router.get('/me/member',verifyToken,getJoinedCommunities)
module.exports= router