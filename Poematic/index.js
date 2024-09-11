import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory array to store blog posts
let blogs = [];

// GET route to render the homepage
app.get("/", (req, res) => {
  res.render("index.ejs", { blogs }); // Pass the blogs array to the homepage
});

// POST route to handle form submission
app.post("/submit", (req, res) => {
  const blogContent = req.body.blogContent; // Get the submitted blog content
  const blogId = Date.now(); // Use a timestamp as a unique ID for each blog

  // Add the new blog to the array
  blogs.push({ id: blogId, content: blogContent });

  // Redirect to the "Poems" page
  res.redirect(`/poems/${blogId}`);
});

// GET route to render the "Poems" page for a specific blog
app.get("/poems/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = blogs.find(b => b.id === blogId); // Find the blog by ID

  if (blog) {
    res.render("poems.ejs", { blogContent: blog.content, blogId: blog.id }); // Render the "Poems" page with the blog content and ID
  } else {
    res.status(404).send("Blog not found"); // Handle case where the blog is not found
  }
});

// POST route to handle deleting a poem
app.post("/delete/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  
  // Filter out the blog with the matching ID
  blogs = blogs.filter(blog => blog.id !== blogId);

  // Redirect back to the homepage
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
