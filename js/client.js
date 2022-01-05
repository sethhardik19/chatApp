const socket = io('http://localhost:8000')

const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")
var audio = new Audio('ting.mp3');

const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send', message);
    messageInput.value = '';
})

const name = prompt("enter your name to join");
const room = prompt("Enter room id");

// var myObj = {
//     name: this.name,
//     room: this.room
// }


socket.on('saved-message', data=>{
    // console.log(data);
    if(data.length){
        data.forEach(message => {
            if(message.name === name){
                append(`You: ${message.msg}`,'right')
            }
            else{
                append(`${message.name}: ${message.msg}`,'left')
            }
        })
    }
})

socket.emit('new-user-joined', {name,room});


// socket.on('user-joined', name=>{
//     append(`${name} joined the chat.`,'left')
// })


socket.on('recieve', data=>{
    append(`${data.name}: ${data.message}`,'left')
})


// socket.on('left', name=>{
//     append(`${name} left the chat`,'left');
// })