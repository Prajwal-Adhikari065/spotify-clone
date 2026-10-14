
import ImageKit, { toFile } from "@imagekit/nodejs";
import dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

if (!privateKey) {
  throw new Error(
    "IMAGEKIT_PRIVATE_KEY is missing from server/.env"
  );
}

const client = new ImageKit({ privateKey });

async function uploadFile(fileBuffer, originalName = "audio.mp3") {
  try {
    const result = await client.files.upload({
      file: await toFile(fileBuffer, originalName),
      fileName: `music_${Date.now()}`,
      folder: "/project-spotify/music", // <--- Removed the space
    });

    return result;
  } catch (error) {
    console.error("ImageKit upload failed:", {
      status: error.status,
      message: error.message,
    });

    throw error;
  }
}

export { uploadFile };
