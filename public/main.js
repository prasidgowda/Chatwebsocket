const socket = io();

const clientsTotal = document.getElementById('clients-total');

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTone=new Audio('/jaishreeram.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`;
});

function sendMessage() {
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        const data = {
            name: nameInput.value,
            message: messageText,
            dateTime: new Date().toISOString()
        };

        socket.emit('message', data);
        addMessageToUI(true, data);

        // Clear the input field after sending the message
        messageInput.value = '';
    }
}

socket.on('chat-message', (data) => {
    messageTone.play()
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const formattedDateTime = moment(data.dateTime).format('YYYY-MM-DD HH:mm:ss');
    const element = `<li class="${isOwnMessage ? "message-right" : "message-left"}">
                     <p class="message">
                         ${data.message}
                         <span>${data.name} ◽ ${formattedDateTime} </span>
                      </p>
                      </li>`;

    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

messageInput.addEventListener('focus',(e) => {
    socket.emit('feedback', {
        feedback: `✍️${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur',(e) => {
    socket.emit('feedback', {
        feedback: ``,
    })
})

socket.on('feedback',(data)=>{
    clearFeedback()
    const element=` <li class="message-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback}
    </p>
 </li>`

 messageContainer.innerHTML +=element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}