import Groq from "groq-sdk";

// Replace 'your-api-key-here' with your actual API key
const groq = new Groq({ apiKey: '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' });

/**
 * Fetches data from Groq using the Groq client.
 * @param {Array} messages - An array of message objects for the chatbot.
 * @returns {Object} - The response from Groq.
 */
export const fetchDataFromGrok = async (messages) => {
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile", // Replace with the desired model
    });
    return completion.choices[0]?.message?.content; // Return the content of the chatbot's response
  } catch (error) {
    console.error("Error fetching data from Groq:", error);
    throw error;
  }
};
