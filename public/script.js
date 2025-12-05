// DOM Elements
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Conversation history to maintain context
const conversation = [];

// API endpoint
const API_URL = '/api/chat';

/**
 * Parses markdown text and converts to HTML
 * Supports: **bold**, *italic*, `code`, ### headings, bullet points, and line breaks
 * @param {string} text - Markdown text
 * @returns {string} - HTML string
 */
function parseMarkdown(text) {
  if (!text) return '';

  // First, escape HTML to prevent XSS
  let result = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process bullet points before other conversions
  // Match lines starting with * followed by space (but not **)
  const lines = result.split('\n');
  const processedLines = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if line starts with "* " but not "**" (bullet point)
    if (/^\* (?!\*)/.test(line)) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      // Remove the "* " and wrap in li
      processedLines.push('<li>' + line.substring(2) + '</li>');
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }

  // Close list if still open
  if (inList) {
    processedLines.push('</ul>');
  }

  result = processedLines.join('\n');

  return result
    // Headers (### text)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold (**text** or __text__) - must be before italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic (*text* or _text_) - only for inline, not bullet points
    .replace(/\*([^\s*][^*]*[^\s*])\*/g, '<em>$1</em>')
    .replace(/\*([^\s*])\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Inline code (`code`)
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Line breaks (but not inside lists)
    .replace(/\n/g, '<br>');
}

/**
 * Appends a message to the chat box
 * @param {string} sender - 'user' or 'bot'
 * @param {string} text - Message content
 * @param {boolean} isHtml - Whether to render as HTML (for bot messages)
 * @returns {HTMLElement} - The created message element
 */
function appendMessage(sender, text, isHtml = false) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  if (isHtml && sender === 'bot') {
    msg.innerHTML = parseMarkdown(text);
  } else {
    msg.textContent = text;
  }

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

    // Replace thinking message with AI response (rendered as HTML)
    thinkingMsg.innerHTML = parseMarkdown(aiResponse);

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
