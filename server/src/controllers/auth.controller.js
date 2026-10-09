import client from "../db/db.js";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";

async function registerUser(req, res) {
    const { username, email, password, role } = req.body;
    
    const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );  
    if (existingUser.rows.length > 0) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }

     const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
    `INSERT INTO users (username, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, role, created_at`,
    [username, email, hashedPassword, role]
);

    const user = result.rows[0];

  const token = jwt.sign(
    { id: user.id, 
        role: user.role 
    },
     process.env.JWT_SECRET
      );
res.cookie('token', token);

    res.status(201).json({
        message: 'User registered successfully',
        user:{
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        }
    });
}

function welcome(req, res) {
    res.status(200).json({
         message: 'Welcome to the API user matha faka' 
    });
}   


function loginUser(req, res) {
    const { email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    client.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2',
        [email, hashedPassword],
        (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const user = result.rows[0];
            res.status(200).json({
                message: 'Login successful',
                user
            });
        }
    );
}


export { registerUser,welcome,loginUser };