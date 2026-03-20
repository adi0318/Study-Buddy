// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// // MongoDB Connection String
// const MONGODB_URI = 'mongodb+srv://aanya:aanya08@cluster0.s8w1y2k.mongodb.net/studybuddy?retryWrites=true&w=majority&appName=Cluster0';

// // Connect to MongoDB
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB successfully');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });

// const db = mongoose.connection;
// db.on('error', (err) => console.error('Connection error:', err));
// db.once('open', () => console.log('Database connected'));

// // Show your HTML page at root
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index1.html')); 
// });

// // Import routes
// const buddyRoutes = require('./routes/buddyRoutes');
// // 💡 Correctly import the new query routes
// // Note: Ensure your file is named 'queryRoutes.js' (with a capital R)
// // The require statement should match the actual filename (e.g., queryRoutes or queryroutes). 
// // Assuming you named it 'queryRoutes.js' based on common practice:
// const queryRoutes = require('./routes/queryroutes'); 

// // Use routes
// app.use('/api', buddyRoutes);
// app.use('/api', queryRoutes); // <-- NEW ROUTE USE

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://aanya:aanya08@cluster0.s8w1y2k.mongodb.net/studybuddy?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const db = mongoose.connection;
db.on('error', (err) => console.error('Connection error:', err));
db.once('open', () => console.log('Database connected'));

// Show your HTML page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index1.html')); 
});

// Import routes
const buddyRoutes = require('./routes/buddyRoutes');
const queryRoutes = require('./routes/queryroutes'); 

// Use routes
app.use('/api', buddyRoutes);
app.use('/api', queryRoutes); // <-- NEW ROUTE USE

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});