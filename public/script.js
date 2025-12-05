// DOM Elements
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Conversation history to maintain context
const conversation = [];

// API endpoint
const API_URL = '/api/chat';

/**
 * Appends a message to the chat box
 * @param {string} sender - 'user' or 'bot'
 * @param {string} text - Message content
 * @returns {HTMLElement} - The created message element
 */
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

/**
 * Sends a message to the backend API
 * @param {Array} conversation - Array of conversation messages
 * @returns {Promise<string>} - The AI response text
 */
async function sendMessageToAPI(conversation) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversation }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.result) {
    throw new Error('No result in response');
  }

  return data.result;
}

/**
 * Handles form submission
 * @param {Event} e - Submit event
 */
async function handleSubmit(e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message to chat
  appendMessage('user', userMessage);
  input.value = '';

  // Add to conversation history
  conversation.push({ role: 'user', content: userMessage });

  // Show thinking indicator
  const thinkingMsg = appendMessage('bot', 'Thinking...');

  try {
    // Send request to API
    const aiResponse = await sendMessageToAPI(conversation);

    // Replace thinking message with AI response
    thinkingMsg.textContent = aiResponse;

    // Add AI response to conversation history
    conversation.push({ role: 'model', content: aiResponse });

  } catch (error) {
    console.error('Error:', error);

    // Show error message
    if (error.message === 'No result in response') {
      thinkingMsg.textContent = 'Sorry, no response received.';
    } else {
      thinkingMsg.textContent = 'Failed to get response from server.';
    }

    // Remove the failed user message from history
    conversation.pop();
  }
}

// Event listener for form submission
form.addEventListener('submit', handleSubmit);

// Optional: Allow sending with Enter key (already handled by form submit)
// and Shift+Enter for new line if using textarea
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    // Form submit will handle this
  }
});
