const axios = require("axios");

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

/**
 * Send a message to the Python chatbot API and get a response
 * @param {string} message - The user's message
 * @param {string} userId - The user's ID for session management
 * @param {string} token - The authorization token to forward to Python API
 * @returns {Promise<Object>} - Returns { sessionId, response }
 */
async function getBotResponse(message, userId, token) {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/chat`, {
      message: message,
      user_id: userId
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    return {
      sessionId: response.data.session_id,
      reply: response.data.response
    };
  } catch (error) {
    console.error("Error calling Python chatbot API:", error.message);
    
    // Fallback response if API is unavailable
    return {
      sessionId: null,
      reply: "I apologize, but I'm having trouble processing your request right now. Please try again later."
    };
  }
}

module.exports = { getBotResponse };
