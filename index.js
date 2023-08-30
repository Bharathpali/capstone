const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const MOVIE_API_KEY = "8b816ebf";

const serviceAccount = require("./Key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // other configuration options
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Implement user creation in Firestore
  try {
    const userRef = db.collection("users").doc(email);
    await userRef.set({ password }); // Storing plaintext password for demonstration purposes
    res.redirect("/signin");
  } catch (error) {
    console.error("Error creating user:", error);
    res.redirect("/signup");
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Implement user authentication with Firestore
  try {
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists && userDoc.data().password === password) {
      res.redirect("/");
    } else {
      res.redirect("/signin");
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.redirect("/signin");
  }
});
app.get("/movies/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const response = await axios.get('http://www.omdbapi.com/apikey.aspx?VERIFYKEY=e43ac21a-3260-46f6-a294-6a5cdf14758d');
      const movies = response.data.results; // Adjust this based on the API response structure
      res.render("movies", { movies });
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.redirect("/");
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
