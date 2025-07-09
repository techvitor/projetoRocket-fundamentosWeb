const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionField = document.getElementById('questionField');
const askButton = document.getElementById('askButton');
const form = document.getElementById('form');
const aiResponse = document.getElementById('aiResponse');

const sendForm = (event) => {
   event.preventDefault()
}

form.addEventListener("submit", sendForm)