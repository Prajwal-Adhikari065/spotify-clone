CREATE TABLE IF NOT EXISTS music (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    fileUrl TEXT NOT NULL,
    artistId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT foreign_key_artist
        FOREIGN KEY (artistId)
        REFERENCES users(id)
);