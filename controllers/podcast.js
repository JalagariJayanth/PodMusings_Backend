const cloudinary = require("../utilities/cloudinary");
const Podcast = require("../models/Podcast")
const Episode = require("../models/Episode");
const User = require("../models/User")
const mongoose=require("mongoose");

const createPodcast = async (req, res, next) => {
    try {
      const { podcast, id } = req.body;
      const { name, desc, thumbnail, tags, type, category, episodes } = podcast;

      const newPodcast = new Podcast({
        name,
        desc,
        thumbnail,
        tags,
        type,
        category,
        creator: id,
      });
  
      const savedPodcast = await newPodcast.save();
  
      const episodeIds = await Promise.all(
        episodes.map(async (episode) => {
          const newEpisode = new Episode({
            name: episode.name,
            desc: episode.desc,
            type: type,
            file: episode.file,
            creator: id,
            podcast: savedPodcast._id,
          });
  
          const savedEpisode = await newEpisode.save();
          return savedEpisode._id;
        })
      );
  
      savedPodcast.episodes = episodeIds;
      await savedPodcast.save();
  
      res.status(200).json({ message: "Podcast created successfully", podcast: savedPodcast });
    } catch (err) {
      next(err);
    }
  };


const uniqueUserPodcasts = async(req,res,next) => {
  try{
    const  {id}  = req.query; 
    const podcasts = await Podcast.find({ creator: id }).populate("creator");

    if (podcasts.length === 0) {
        return res.status(404).json({ message: 'No podcasts uploaded.' });
    }
    res.status(200).json({ podcasts });
  }catch (err) {
    next(err);
  }
}

const getEpisodes = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const episodes = await Episode.find({ podcast: id });

      if (episodes.length === 0) {
        return res.status(404).json({ message: "No episodes found for this podcast" });
      }
  
      res.status(200).json({ podcastId: id, episodes });
    } catch (err) {
      next(err);
    }
};


const allPodcasts = async(req,res,next) => {
  try{
    const podcasts = await Podcast.find().populate('creator')

    return res.status(200).json({podcasts:podcasts})

  }catch(err){
     next(err);
  }
}
  

const favouritePodcast = async (req, res, next) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return next(createError(400, "Invalid Podcast ID!"));
    }

    const userId = req.user.id; 

    const objectId =new  mongoose.Types.ObjectId(id);

    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const isFavorite = user.favourites.some(favId => favId.equals(objectId));

    if (isFavorite) {
      user.favourites = user.favourites.filter(favId => !favId.equals(objectId));
      await user.save();
      return res.status(200).json({ message: "Podcast removed from favorites!" });
    } else {
      user.favourites.push(objectId);
      await user.save();
      return res.status(200).json({ message: "Podcast added to favorites!" });
    }
  } catch (error) {
    next(error);
  }
};

const getFavouritePodcasts = async(req,res,next) => {
  try{
    const { id } = req.body;

    if (!id) {
      return next(createError(400, "Invalid Podcast ID!"));
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found!"));
    }
    
    const favouritePodcastIds = user.favourites;

    if (!favouritePodcastIds || favouritePodcastIds.length === 0) {
      return res.status(200).json({ message: "No favourite podcasts found!", podcasts: [] });
    }

    const favouritePodcasts = await Podcast.find({
      _id: { $in: favouritePodcastIds },
    });


    return res.status(200).json({ podcasts: favouritePodcasts });

  }catch(error){
    next(error);
  }
}


const search = async(req,res,next) => {
  try{
    const query = req.query.q;

    const podcast = await Podcast.find({
      name: { $regex: query, $options: "i" },
    }).populate("creator")
    res.status(200).json(podcast)
  }catch(err){
    next(err);
  }
}



const addView = async (req, res, next) => {
  try {
    await Podcast.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};


const deletePodcast = async(req,res,next) => {
  try{

    const podcastId = req.params.id;
    const userId = req.user.id;

    const podcast = await Podcast.findById(podcastId);

    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }


    await Podcast.deleteOne({ _id: podcastId });

    res.status(200).json({ message: 'Podcast deleted successfully' });

  }catch(err){
    next(err);
  }
}


module.exports = {deletePodcast,createPodcast,uniqueUserPodcasts,getEpisodes,allPodcasts,favouritePodcast,getFavouritePodcasts,search,addView}