//THIS IS FOR TESTING WITH LOCALHOST
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Define the port

// Serve static files from the same directory
app.use(express.static(__dirname));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});