const User = require('../Models/User.js')
const bcrypt = require('bcrypt')
const { Snowflake } = require('@theinternetfolks/snowflake')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    try {
        // Retrieve user data from request body
        const {
            name,
            email,
            password,
        } = req.body;

        // Check if user with the same email already exists
        const currentuser = await User.findOne({ email });
        if (currentuser) {
            return res.status(401).json({ message: "User with mail already exists try login" });
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = Snowflake.generate()
            // Create a new user instance
            const newUser = new User({
                _id: id,
                name,
                email,
                password: hashedPassword,
            });
            // Save the user to the database
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const payload = {
            user: {
                id: user._id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) throw err;
                res.cookie("acessToken", token, { httpOnly: true });
                res.status(200).json({ message: "Login successful" });
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.me = async (req, res) => {
    try {
        // Retrieve the token from the request cookies
        // console.log(req.cookies.acessToken)
        const token = req.cookies.acessToken;
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                // Extract the user ID from the decoded token payload
                const userId = decoded.user.id;

                // Find the user in the database by ID
                const user = await User.findById(userId);


                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                } else {
                    // Return the user details
                    res.status(200).json(user);
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};