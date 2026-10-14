import client from "../db/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function registerUser(req, res) {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const existingUser = await client.query(
            'SELECT id, username, email FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            const match = existingUser.rows[0];
            const field = match.email === email ? 'Email' : 'Username';
            return res.status(400).json({
                message: `${field} is already taken`
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = role || 'user';

        const result = await client.query(
            `INSERT INTO users (username, email, password, role)
             VALUES ($1, $2, $3, COALESCE($4, 'user'))
             RETURNING id, username, email, role, created_at`,
            [username, email, hashedPassword, role || null]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        return res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (err) {
        console.error('Error in registerUser:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

function welcome(req, res) {
    res.status(200).json({
        message: 'Welcome to the API'
    });
}

async function loginUser(req, res) {
    try {
        const identifier = req.body.email || req.body.username;
        const { password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Username/email and password are required' });
        }

        const result = await client.query(
            'SELECT * FROM users WHERE email = $1 OR username = $1',
            [identifier]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0]; // Removed the stray empty block {}

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword
        });
    } catch (err) {
        console.error('Error in loginUser:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { registerUser, welcome, loginUser };