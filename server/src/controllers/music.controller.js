import client from "../db/db.js";
import jwt from "jsonwebtoken";
import { uploadFile } from "../services/storage.service.js";

async function createMusic(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let decoded; 
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only artists can create music" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title } = req.body;
  const file = req.file;

  
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await uploadFile(file.buffer); 

    const music = { 
      title,
      fileUrl: result.url,
      artistId: decoded.id, 
    };

 const query = "INSERT INTO music (title, fileUrl, artistId) VALUES ($1, $2, $3)";
    const values = [music.title, music.fileUrl, music.artistId];

    await client.query(query, values); // Changed from client.execute to client.query
    res.status(201).json({ message: "Music created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create music" });
}
}
export { createMusic };
