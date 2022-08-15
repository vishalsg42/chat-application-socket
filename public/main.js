const WEBSOCKET_URL = "http://localhost:8008";

const socket = io(WEBSOCKET_URL);

// Total Client
const clientsTotalEl = document.querySelector("#clients-total");
socket.on("clients-total", (data) => {
    console.log(data);
    clientsTotalEl.innerText = `Total Client: ${data}`;
});

const messageContainer = document.querySelector("#message-container");
const nameInput = document.querySelector("#name-input");
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");

const messageTone = new Audio("/message-tone.mp3");

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    console.log(messageInput.value);
    if (messageInput.value === '') return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    }

    socket.emit('message', data);
    addMessagetoUI(true, data);
    messageInput.value = "";
}

// On Listenign chat-message event from the server
socket.on("chat-message", function (data) {
    messageTone.play();
    addMessagetoUI(false, data);
})

function addMessagetoUI(isOwnMessage, data) {
    // return 
    clearFeedback();
    const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
        <p class="message">
            ${data.message}
            <span>${data.name} ⚪️ ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>
    `;
    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit("feedback", {
        feedback: `✍️ ${nameInput.value} is typing a message`,
    })
});

messageInput.addEventListener('keypress', (e) => {
    socket.emit("feedback", {
        feedback: `✍️ ${nameInput.value} is typing a message`,
    })

});

messageInput.addEventListener('blur', (e) => {
    socket.emit("feedback", {
        feedback: '',
    })
});

socket.on("feedback", (data) => {
    clearFeedback();
    const element = `
    <li class="message-feedback">
        <p class="feedback" id="feedback">
            ${data.feedback}
        </p>
    </li>
    `;
    messageContainer.innerHTML += element;
});

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    });
}