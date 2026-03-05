require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect Database
connectDB();

app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api', require('./routes/streetlightRoutes'));
app.use('/api', require('./routes/dataRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
