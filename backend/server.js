
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


app.set('io', io);

app.use(cors());
app.use(express.json());

// ROUTES
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/taskRoutes')(io);  
const logRoutes = require('./routes/logRoutes');         

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);  
app.use('/api/logs', logRoutes);    
app.get('/', (req, res) => {
  res.send('Kanban Backend is running');
});


server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
