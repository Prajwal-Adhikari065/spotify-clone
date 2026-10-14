import client from "../db/db.js";
import jwt from "jsonwebtoken";
import { uploadFile } from "../services/storage.service.js";

async function createMusic(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

  const result = await uploadFile(file.buffer.tostring("base64"));

  const music = {
    title,
    fileUrl: result.url,
    artistId: decoded.id,
  };

  const query = "INSERT INTO music (title, fileUrl, artistId) VALUES (?, ?, ?)";
  const values = [music.title, music.fileUrl, music.artistId];

  try {
    await client.execute(query, values);
    res.status(201).json({ message: "Music created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { createMusic };
