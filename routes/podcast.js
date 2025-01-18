const express = require("express");
const {addView,deletePodcast, createPodcast,uniqueUserPodcasts,getEpisodes,allPodcasts,favouritePodcast,getFavouritePodcasts,search } = require("../controllers/podcast");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/create",verifyToken,createPodcast)

router.get("/getUserUploads",verifyToken,uniqueUserPodcasts)

router.get("/allPodcasts",allPodcasts)
router.get("/search",search)
router.get("/:id",getEpisodes)

router.post("/favourite",verifyToken,favouritePodcast)
router.post("/getFavouritePodcasts",verifyToken,getFavouritePodcasts)
router.post("/addview/:id",addView); 
router.delete("/delete/:id",verifyToken,deletePodcast)


module.exports = router;