const Member = require('../Models/Member');
const Community = require('../Models/Community');
const Role=require('../Models/Role')
const { Snowflake } = require('@theinternetfolks/snowflake');

const checkIfUserIsCommunityAdmin = async ({ communityId, userId }) => {
    try {
        const community = await Community.findById(communityId);
        if (!community) {
            throw new Error("Community not found");
        }

        if (community.owner === userId) {
            // User is the owner, allow access
            return true;
        }

        // If not the owner, check if the user has admin role
        const member = await Member.findOne({ community: communityId, user: userId });
        if (!member || !member.role) {
            throw new Error("User does not have a valid role");
        }

        // Fetch the role details from the Role model
        const role = await Role.findById(member.role);
        if (!role || role.name !== 'admin') {
            throw new Error("User does not have permission to add members.");
        }

        // User has admin role, allow access
        return true;
    } catch (error) {
        console.error(error);
        throw new Error("Internal server error");
    }
};

exports.addMember = async (req, res) => {
    try {
        // Extract community, user, and role IDs from the request body
        const { community, user, role } = req.body;
       const adminId=req.userId
        // Check if the user has the role of Community Admin

        const isCommunityAdmin = await checkIfUserIsCommunityAdmin({ communityId: community, userId: adminId });

        if (!isCommunityAdmin) {
            return res.status(403).json({ status: false, message: "Only Community Admin/owner can add members" });
        }

        const id = Snowflake.generate();

        // Create a new member instance
        const newMember = new Member({
            _id: id,
            community,
            user,
            role
        });

        // Save the new member to the database
        await newMember.save();

        res.status(201).json({ status: true, message: "Member added successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: false, message: error.message });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const adminId = req.userId; 

        // Find the member by ID
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Check if the user is a community admin or owner
        const isCommunityAdmin = await checkIfUserIsCommunityAdmin({ communityId: member.community, userId: adminId });

        if (!isCommunityAdmin) {
            return res.status(403).json({ status: false, message: "Only Community Admin/owner can remove members" });
        }

        // Remove the member from the database
        await Member.findByIdAndDelete(memberId);

        res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error in removeMember function:', error.message);
        res.status(500).json({ message: `${error}` });
    }
};

