const bcrypt = require("bcryptjs");

require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// Importing models
const TravelStory = require('./models/travelStory.model');
const Comment = require('./models/Comment');

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

// const cors = require("cors");






const { authenticateToken } = require("./utilities");

const User = require("./models/user.model");
// const TravelStory = require("./models/travelStory.model");
mongoose.connect(config.connectionString);

const app = express();
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:4173'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`); // Debugging line
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Added 'OPTIONS'
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// ✅ Apply CORS
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Handle Preflight Requests Properly
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204); // No Content
});

// ✅ Example Route (Test this manually)
app.get('/test', (req, res) => {
  res.json({ message: "CORS is working!" });
});

//create account api
app.post("/create-account", async (req, res) => {


  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "all fields are required!!" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res
      .status(400)
      .json({ error: true, message: "user alredy exists" });
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullName, email, password: hashedPassword,
  });

  await user.save();
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.status(201).json({
    error: false,
    user: {
      fullName: user.fullName, email: user.email
    },
    accessToken,
    message: "registraion sucess",
  });
});

//login
app.post("/login", async (req, res) => {


  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password fields are required!!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "user not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "invalid credentials" });
  }

  const accessToken = jwt.sign(
    {
      userId: user._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.json({
    error: false,
    message: "login successful",
    user: {
      _id: user._id,  // ✅ Add userId here
      fullName: user.fullName,
      email: user.email
    },
    accessToken
  });
  
})

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {

  const { userId } = req.user;

  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  })

})

// Route to handle image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    console.log("File Upload Request Received");

    if (!req.file) {
      console.error("No file received");
      return res.status(400).json({ error: true, message: "No image uploaded" });
    }

    console.log("File details:", req.file);

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

    return res.status(200).json({ imageUrl });
    //here change
  } catch (error) {
    console.error("Image upload failed:", error);
    return res.status(500).json({ error: true, message: error.message });
  }
});

// Delete an image from uploads folder
app.delete("/delete-image", async (req, res) => { 
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "imageUrl parameter is required" });
  }

  try {
    // Extract the filename from the imageUrl
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file from the uploads folder
      fs.unlinkSync(filePath);

      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// server static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Validate required fields
  if (!title || !story || !visitedLocation || !visitedDate) {
    return res.status(400).json({ error: true, message: "All fields except imageUrl are required" });
  }

  // Convert visitedDate to a valid Date object
  const parsedVisitedDate = new Date(visitedDate);

  if (isNaN(parsedVisitedDate.getTime())) {
    return res.status(400).json({ error: true, message: "Invalid date format" });
  }

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation: Array.isArray(visitedLocation) ? visitedLocation : [visitedLocation], // Ensure array format
      userId,
      imageUrl: imageUrl || "", // ✅ Optional
      visitedDate: parsedVisitedDate, // ✅ Stores as Date in MongoDB
    });

    await travelStory.save();

    res.status(201).json({ story: travelStory, message: "Added Successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});


// Get All Travel Stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
  try {
    const travelStories = await TravelStory.find().sort({ isFavourite: -1 });

    res.status(200).json({ stories: travelStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


//edit story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Validate required fields
  if (!title || !story || !visitedLocation || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  // Convert visitedDate properly
  const parsedVisitedDate = new Date(visitedDate);

  if (isNaN(parsedVisitedDate.getTime())) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid visitedDate format" });
  }

  try {
    const placeholderImgUrl = "http://localhost:8000/assets/placeholder.png";//changes here

    

    // Update travel story only if it belongs to the authenticated user
    const updatedStory = await TravelStory.findOneAndUpdate(
      { _id: id, userId: userId },
      {
        title,
        story,
        visitedLocation: Array.isArray(visitedLocation) ? visitedLocation : [visitedLocation], // Ensure array
        imageUrl: imageUrl || placeholderImgUrl,
        visitedDate: parsedVisitedDate,
      },
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!updatedStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found or not authorized" });
    }

    res.status(200).json({ story: updatedStory, message: "Update Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


// delete story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    // Find the travel story by ID and ensure it belongs to the authenticated user
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    // Delete the travel story from the database
    await travelStory.deleteOne({ _id: id, userId: userId });

    // Extract filename from imageUrl
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, 'uploads', filename);

    // Delete the image file from the uploads folder
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Failed to delete image file:", err);
      // Optionally, log the error but continue with deletion success
    }

    res.status(200).json({ message: "Travel story deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Update isFavourite
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    travelStory.isFavourite = isFavourite;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update Successful" });

  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Search travel stories
app.get("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res.status(404).json({ error: true, message: "query is required" });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});



// Filter travel stories by date range
app.get("/stories/:storyId/comments", async (req, res) => {
  try {
      const { storyId } = req.params;

      // Validate storyId
      if (!mongoose.Types.ObjectId.isValid(storyId)) {
          return res.status(400).json({ message: "Invalid story ID format" });
      }

      // Fetch the travel story along with its owner details
      const story = await TravelStory.findById(storyId).populate("userId", "fullName email");
      if (!story) {
          return res.status(404).json({ message: "Travel story not found" });
      }

      // Fetch comments related to the story
      const comments = await Comment.find({ travelStoryId: storyId })
          .populate("userId", "fullName email") // Populating only fullName and email of comment users
          .sort({ createdOn: -1 });

      // Append post owner's details to each comment response
      const response = comments.map(comment => ({
          ...comment.toObject(),
          postOwner: {
              fullName: story.userId.fullName,
              userId: story.userId._id,
          }
      }));

      res.status(200).json(response);
  } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
  }
});



////////////////////////////////////////////////////////


// POST /stories/:id/comments - Add a comment to a specific story


app.post("/stories/:storyId/comments", async (req, res) => {
  try {
      const { storyId } = req.params;
      const { userId, commentText } = req.body;

      if (!userId) return res.status(400).json({ error: "User ID is required" });
      if (!commentText) return res.status(400).json({ error: "Comment text is required" });

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(storyId)) {
          return res.status(400).json({ error: "Invalid story ID" });
      }

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const newComment = new Comment({
          travelStoryId: storyId,
          userId,
          commentText,
          createdOn: new Date(),
      });

      await newComment.save();
      res.status(201).json(newComment);
  } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
  }
});


//get
app.get("/stories/:storyId/comments", async (req, res) => {
  try {
      const { storyId } = req.params;

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(storyId)) {
          return res.status(400).json({ error: "Invalid story ID" });
      }

      const comments = await Comment.find({ travelStoryId: storyId })
          .populate("userId", "fullName email");

      res.status(200).json(comments);
  } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
  }
});




// Like a story
app.put("/stories/:id/like", async (req, res) => {
  try {
    const story = await TravelStory.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }, // ✅ Increase likes by 1
      { new: true }
    );
    
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    
    res.json(story);
  } catch (error) {
    console.error("Error liking the story:", error);
    res.status(500).json({ error: "Server error" });
  }
});


//likes
app.put("/stories/:id/like", async (req, res) => {
  try {
    const story = await TravelStory.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }, // Increment likes
      { new: true }
    );
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    let filter = { userId };

    // Validate and parse dates
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ error: true, message: "Invalid startDate format" });
      }
      filter.visitedDate = { ...filter.visitedDate, $gte: start };
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({ error: true, message: "Invalid endDate format" });
      }

      if (filter.visitedDate?.$gte && end < filter.visitedDate.$gte) {
        return res.status(400).json({ error: true, message: "endDate cannot be before startDate" });
      }

      filter.visitedDate = { ...filter.visitedDate, $lte: end };
    }

    // Find travel stories and sort by isFavourite (descending)
    const filteredStories = await TravelStory.find(filter).sort({ isFavourite: -1 });

    res.status(200).json({ stories: filteredStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
module.exports = app;
