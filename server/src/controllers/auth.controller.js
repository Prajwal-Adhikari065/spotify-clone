import client from "../db/db.js";

async function registerUser(req, res) {
    const { username, password, email } = req.body;
    
    const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );  
    if (existingUser.rows.length > 0) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }

    const result = await client.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [username, email, password]
);

    const user = result.rows[0];

    res.status(201).json({
        message: 'User registered successfully',
        user
    });
}

function welcome(req, res) {
    res.status(200).json({
         message: 'Welcome to the API user matha faka' 
    });
}   


function loginUser(req, res) {
    const { email, password } = req.body;

    client.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2',
        [email, password],
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

function registerUser(req, res) {
    const { username, password, email } = req.body;

    client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [username, email, password],
        (err, result) => {
            if (err) {
                console.error('Error executing query', err.stack);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const user = result.rows[0];
            res.status(201).json({
                message: 'User registered successfully',
                user
            });
        }
    );
}
export { registerUser,welcome,loginUser };