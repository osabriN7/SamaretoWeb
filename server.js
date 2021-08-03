const express = require('express');
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user.routes')
require('dotenv').config({path: './config/.env'})
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'], 
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }
//routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

//jwt
app.get('*', checkUser);

app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
})
app.use('/api/user', userRoutes);


app.listen(process.env.PORT, () => {
    console.log(`listen on port ${process.env.PORT}`);
})

 //socket.io
const io = require('socket.io')(process.env.SOCKET_PORT, {
    cors:{
        origin:process.env.CLIENT_URL,
    }
})


io.on("connection", socket => {
    console.log("connected socket-io")
    socket.on('get-diagram', diagramId => {
    socket.join(diagramId)
    socket.on('send-changes', data=> {
        socket.broadcast.to(diagramId).emit('receive-changes',data)
    })
    
})
    

/*     socket.on('send-tree-data', treeData=> {
     socket.broadcast.emit('receive-tree-data', treeData)
 })
 socket.on('get-diagram', diagramId=> {

    socket.join(diagramId)
 })


 socket.on('send-matrix', matrix=> {
     socket.broadcast.emit('receive-matrix', matrix)
 })
 socket.on('mouse_activity', data=> {
     socket.broadcast.emit('all_mouse_activity', {session_id: socket.id, coords:data})
 }) */
 }) 