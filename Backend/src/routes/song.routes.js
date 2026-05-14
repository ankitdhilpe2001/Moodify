const { Router } = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const songController = require("../controller/song.controller");
const upload = require("../middleware/uploadSong");

const router = Router();

// Post api/songs/
router.post("/", upload.single("song"), songController.uploadSong);

// Get single song recommendation
router.get("/",songController.getSongs)

//Get the playlist of songs according to the mood
router.get("/playlist",songController.getSongPlaylist);

module.exports = router;
