const batch = 1017;
const baseUrl = "https://wagon-chat.herokuapp.com/";
const endpoint = `${baseUrl}/${batch}/messages`;
const username = document.querySelector("#username")
const sendMessage = document.querySelector(`[aria-label="Message"]`)
const sendBtn = document.querySelector(".send-button")
const chat = document.querySelector(".chat-conversations")

const postMessage = (e) => {
  e.preventDefault();
  const body = {
    content: sendMessage.value,
    author: username.value,
  };
  fetch(endpoint, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(response => response.json())
    .then((data) => {
      console.log(data);
    });
  sendMessage.value = "";
};

calculateTime= (createdAt) => {
  const currentTime = Date.now();
  const messageTime = Date.parse(createdAt);
  let timeDiff =  Math.round((currentTime - messageTime) / 1000);

  if (timeDiff < 60) {
    return `${timeDiff} secs`;
  } else if (timeDiff >= 60 && (timeDiff /60) < 60) {
    return `${Math.round(timeDiff/60)} mins`;
  } else if ((timeDiff /60) > 60 && (timeDiff / 3600 < 24)) {
    return `${Math.round(timeDiff/3600)} hours`;
  }
}

const displayMessages = (messages) => {
  chat.innerHTML = "";
  messages.forEach((message) => {
    const author = message.author;
    const content = message.content.replaceAll("<", "");
    const postedOn = calculateTime(message.created_at);

    chat.insertAdjacentHTML("beforeend",
      `<div class="message">
        <img src="../images/avatar.png" alt="">
        <div class="message-content">
          <p><strong>${author}</strong><span class="time float-end">Posted ${postedOn} ago</span></p>
          <p>${content}</p>
        </div>
      </div>`)
  });
};

const refresh = async() => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const messages = data.messages
      displayMessages(messages);
    } catch(error) {
      console.log(error);
    };
};

sendBtn.addEventListener("click", postMessage);
document.addEventListener("DOMContentLoaded", () => {
  setInterval(refresh, 500);
});
