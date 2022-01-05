const mongoose = require('mongoose');
// const Msg = require('C:/Users/vaibh/Desktop/messenger/models/messages.js');
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

// const mongoDB = 'mongodb+srv://sethhardik:password123seth@cluster0.q3mr3.mongodb.net/message-database?retryWrites=true&w=majority';
// mongoose.connect(mongoDB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true}).then(()=>{
//     console.log('database connected');
// }).catch(err => console.log(err));

mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	console.log("Connection Successful!");
	
	// define Schema
	const messageSchema = mongoose.Schema({
	  msg: String,
      name: String,
	  room: Number
	});
    const Msg = mongoose.model('Msg', messageSchema, 'message');

    const users = {};
    const rooms = {};
    
    io.on('connection', socket=>{

        


        socket.on('new-user-joined', ({name,room}) =>{
            users[socket.id] = name;
            rooms[socket.id]=room;

            Msg.find({room:rooms[socket.id]}).then(result =>{
                socket.emit('saved-message', result);
            })
            
            // socket.broadcast.emit('user-joined', name);

        });

        socket.on('send', message =>{
            const mess = new Msg({msg:message,name:users[socket.id],room:rooms[socket.id]});
            mess.save(function (err) {
                if (err) return console.error(err);
                socket.broadcast.emit('recieve', {message: message, name: users[socket.id]});
                // console.log("saved");
              })
        });
        socket.on('disconnect', message=>{
          // socket.broadcast.emit('left',users[socket.id]);
          delete users[socket.id];
          delete rooms[socket.id];
        });
    });
});    
