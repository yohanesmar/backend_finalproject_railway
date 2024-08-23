const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    static async register(req, res) {
        try {
            const { name, username, email, password, address, phoneNumber } = req.body;
            const hashedPassword = bcrypt.hashSync(password, 10);
            const user = await User.create({
                name,
                username,
                email,
                password: hashedPassword,
                role: 'admin',
                address,
                phoneNumber
            });

            res.status(201).json({
                message: "Success creating new user",
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                address: user.address
            });
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ error: "Unauthorized", message: "Invalid username/password" });
            }

            const accessToken = jwt.sign(
                { id: user.id, name: user.name, role: user.role },
                'secret',
                { expiresIn: '1h' }
            );

            res.status(200).json({
                accessToken,
                name: user.name,
                role: user.role,
                id: user.id
            });
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = AuthController;
