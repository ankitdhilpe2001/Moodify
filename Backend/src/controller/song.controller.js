const Song = require("../models/Song");
const nodeid3 = require("node-id3");
const storageService = require("../services/storage.services");

// To upload the song in imagekit and save in DB
async function uploadSong(req, res) {
  try {
    const songBuffer = req.file.buffer; //Get the buffer
    const { mood } = req.body; //The mood from request body
    const tags = nodeid3.read(req.file.buffer); //Read the tags from the bufffer
    const baseFilename =
      tags?.title ||
      req.file?.originalname?.replace(/\.[^/.]+$/, "") ||
      `song-${Date.now()}`;

    // Upload song and poster in parallel
    const [songFile, posterFile] = await Promise.all([
      storageService.uploadFile({
        buffer: songBuffer,
        filename: `${baseFilename}.mp3`,
        folder: "/cohort-2/moodify/songs",
      }),
      storageService.uploadFile({
        buffer: tags.image.imageBuffer,
        filename: `${baseFilename}.jpeg`,
        folder: "/cohort-2/moodify/posters",
      }),
    ]);
    //The songFile was getting uploaded to ImageKit
    // converted that block to Promise.all so songFile and posterFile upload concurrently in song.controller.js.

    //Creating songs in DB
    const song = await Song.create({
      url: songFile.url,
      posterUrl: posterFile.url,
      title: baseFilename,
      singer: tags.artist,
      mood: mood,
    });

    return res.status(201).json({ message: "Song created", song });
  } catch (error) {
    console.log(error)
  }
}

async function getSongs(req, res) {
  const { mood } = req.query;

  if (!mood) {
    return res.status(400).json({ message: "Mood is required" });
  }

  const songs = await Song.aggregate([
    { $match: { mood } },
    { $sample: { size: 1 } },
  ]);

  if (!songs.length) {
    return res.status(404).json({ message: "No song found for this mood" });
  }

  return res.status(200).json({
    message: "Song fetched successfully",
    song: songs[0],
  });
}

async function getSongPlaylist(req, res) {
  const { mood, limit = 10 } = req.query;

  if (!mood) {
    return res.status(400).json({ message: "Mood is required" });
  }

  const songPlaylist = await Song.find({ mood })
    .limit(Number(limit))
    .lean();

  return res.status(200).json({ message: "Success", songPlaylist });
}

module.exports = { uploadSong, getSongs, getSongPlaylist };

{
  /*node-id3 is a pure JavaScript library for Node.js used to read, write, and update ID3 metadata tags (like title, artist, album, and lyrics) in MP3 files. Its purpose is to easily manage audio metadata without external dependencies, allowing for reading tags, creating new tags, or updating existing tag data in files or buffers*/
}
