// app.js

const socket = io();

const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    const username = document.getElementById("username-input").value.trim();

    if (message !== "" && username !== "") {
        socket.emit("chat message", {
            text: message,
            user: username
        });

        messageInput.value = "";
    }
}

socket.on("chat message", function(message) {
    const messageElement = document.createElement("div");

    messageElement.classList.add("message");

    // check if it's your message
    if (message.user === document.getElementById("username-input").value) {
        messageElement.classList.add("sent");
    } else {
        messageElement.classList.add("received");
    }

    messageElement.textContent = message.user + ": " + message.text;

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});