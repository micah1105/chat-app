const socket = io();

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");

const sound = new Audio("https://www.myinstants.com/media/sounds/message-tone.mp3");

// join chat
function join() {
    const username = document.getElementById("username-input").value;
    socket.emit("join", username);
}

// send message
function sendMessage() {
    const message = messageInput.value;
    const username = document.getElementById("username-input").value;

    if (!message || !username) return;

    socket.emit("chat message", {
        user: username,
        text: message
    });

    messageInput.value = "";
}

// emojis
function addEmoji(e) {
    messageInput.value += e;
}

// typing
messageInput.addEventListener("input", () => {
    const username = document.getElementById("username-input").value;
    socket.emit("typing", username);
});

// receive messages
socket.on("chat message", (msg) => {

    sound.play();

    const div = document.createElement("div");
    div.classList.add("message");

    const me = document.getElementById("username-input").value;
    const isMe = msg.user === me;

    div.classList.add(isMe ? "sent" : "received");

    div.innerHTML = `
        <span style="color:${msg.color}">
            ● ${msg.user}
        </span>
        <br>
        ${msg.text}
        <div style="font-size:10px; opacity:0.6;">
            ${msg.time}
        </div>
    `;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// user list
socket.on("user list", (users) => {
    const list = document.getElementById("user-list");
    list.innerHTML = "";

    Object.values(users).forEach(u => {
        const div = document.createElement("div");
        div.textContent = "🟢 " + u.name;
        list.appendChild(div);
    });
});

// typing indicator
socket.on("typing", (user) => {
    const t = document.getElementById("typing");
    t.textContent = user + " is typing...";
    setTimeout(() => t.textContent = "", 1000);
});

// auto join when typing name
document.getElementById("username-input").addEventListener("change", join);
