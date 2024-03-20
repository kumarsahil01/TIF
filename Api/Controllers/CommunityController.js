const Community =require('../Models/Community')
const Member=require('../Models/Member')
const { Snowflake } = require('@theinternetfolks/snowflake')

exports.createCommunity=async(req,res)=>{
    try{
        const {name}=req.body
        const owner = req.userId;
        const id=Snowflake.generate();
        const community=new Community({
            _id:id,
            name,
            owner,
            slug:name.toLowerCase().replace(/\s+/g, '-'),
        })
    
        await community.save()
        res.status(201).json({ message: 'Community created successfully', community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getCommunities = async (req, res) => {
    try {
        // Use the userId from the request object
        const userId = req.userId;

        const communities = await Community.find().populate('owner', 'id name');

        const formattedCommunities = communities.map(community => ({
            id: community.id,
            name: community.name,
            slug: community.slug,
            owner: community.owner,
            created_at: community.created_at,
            updated_at: community.updated_at
        }));

        // Return the formatted output
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: formattedCommunities.length,
                    pages: formattedCommunities%10,
                    page: 1
                },
                data: formattedCommunities
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalMembers = await Member.countDocuments({ community: id });
        const totalPages = Math.ceil(totalMembers / limit);

        const members = await Member.find({ community: id })
            .populate('user', '_id name')
            .populate('role', '_id name')
            .skip(skip)
            .limit(limit)
            .exec();
        console.log(members)
        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalMembers,
                    pages: totalPages,
                    page: page
                },
                data: members
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getOwnedCommunities = async (req, res) => {
    try {
        const ownerId = req.userId; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalCommunities = await Community.countDocuments({ owner: ownerId });
        const totalPages = Math.ceil(totalCommunities / limit);

        const communities = await Community.find({ owner: ownerId })
            .skip(skip)
            .limit(limit)
            .exec();

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCommunities,
                    pages: totalPages,
                    page: page
                },
                data: communities
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getJoinedCommunities = async (req, res) => {
    try {
        const userId = req.userId; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalCommunities = await Member.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalCommunities / limit);

        const communities = await Member.find({ user: userId })
            .populate({
                path: 'community',
                populate: {
                    path: 'owner',
                    select: 'id name'
                },
                select: 'id name slug owner created_at updated_at'
            })
            .skip(skip)
            .limit(limit)
            .exec();

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: totalCommunities,
                    pages: totalPages,
                    page: page
                },
                data: communities.map(member => ({
                    id: member.community.id,
                    name: member.community.name,
                    slug: member.community.slug,
                    owner: member.community.owner,
                    created_at: member.community.created_at,
                    updated_at: member.community.updated_at
                }))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

