const socket = io();

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");

// LOGIN
function login() {
    const username = document.getElementById("username-input").value;
    if (!username) return;

    socket.emit("login", username);
}

// SEND MESSAGE
function sendMessage() {
    const text = messageInput.value;
    if (!text) return;

    socket.emit("chat message", { text });
    messageInput.value = "";
}

// JOIN ROOM
document.getElementById("room-select").addEventListener("change", (e) => {
    socket.emit("join room", e.target.value);
});

// TYPING
messageInput.addEventListener("input", () => {
    socket.emit("typing");
});

// RECEIVE MESSAGE
socket.on("chat message", (msg) => {
    const div = document.createElement("div");

    div.classList.add("message");

    const currentUser = document.getElementById("username-input").value;
    div.classList.add(msg.user === currentUser ? "sent" : "received");

    div.innerHTML = `
        <b>${msg.user}</b><br>
        ${msg.text}
        <div style="font-size:10px; opacity:0.6;">
            ${msg.time}
        </div>
    `;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// LOAD OLD MESSAGES
socket.on("load messages", (msgs) => {
    chatBox.innerHTML = "";
    msgs.forEach(m => {
        socket.emit("chat message", { text: m.text });
    });
});

// USER LIST
socket.on("user list", (users) => {
    const list = document.getElementById("user-list");
    list.innerHTML = "";

    Object.values(users).forEach(u => {
        const div = document.createElement("div");
        div.textContent = "🟢 " + u;
        list.appendChild(div);
    });
});

// TYPING
socket.on("typing", (user) => {
    const t = document.getElementById("typing");
    t.textContent = user + " is typing...";
    setTimeout(() => t.textContent = "", 1000);
});

// auto login trigger
document.getElementById("username-input").addEventListener("change", login);
