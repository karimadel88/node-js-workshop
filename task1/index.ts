import express from "express";
import * as dotenv from "dotenv";
const app = express();
dotenv.config();
const PORT = process.env.PORT;

// Define the Post interface
interface Post {
  id: number;
  postDetails: string;
  date: string;
}

// Create a Map to store posts with their IDs as keys
const posts = new Map<number, Post>();

// Middleware to parse request body as JSON
app.use(express.json());

// GET route to fetch all posts
app.get("/posts", (request, response) => {
  // Convert the Map values to an array and send as response
  response.send({ posts: Array.from(posts.values()) });
});

// POST route to create a new post
app.post("/posts", (request, response) => {
  const post: Post = request.body;

  if (!post || !post.id || !post.postDetails) {
    // Return an error response if request body is invalid
    return response.status(400).send({ error: "Invalid request body" });
  }

  // Set the date to current ISO string
  post.date = new Date().toISOString();
  // Add the post to the Map with its ID as the key
  posts.set(post.id, post);
  // Send success response with the created post and a message
  return response.send({ post, message: "Done" });
});

// DELETE route to delete a post by ID
app.delete("/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  if (posts.has(id)) {
    // Delete the post from the Map if it exists
    posts.delete(id);
    // Send success response with a message
    return response.send({ message: "Done" });
  }
  // Send error response if post does not exist
  return response.status(400).send({ error: "Post does not exist" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server Starting at PORT ${PORT}`);
});
