const Role = require('../Models/Role');
const { Snowflake } = require('@theinternetfolks/snowflake')
exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (name.length < 2) {
            return res.status(400).json({ message: "Name must be at least 2 characters long" });
        }
         const id=Snowflake.generate()
        const newRole = new Role({
            _id:id,
            name
        });
        await newRole.save();
        res.status(201).json({ status: true, content: { data: newRole } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        // Retrieve all roles from the database
        const roles = await Role.find();

        // Return the roles in the response
        res.status(200).json({ status: true, content: { data: roles } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
};
