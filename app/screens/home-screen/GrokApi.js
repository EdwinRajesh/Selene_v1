import Groq from "groq-sdk";


const groq = new Groq({ apiKey: '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' });

/**
 
 * @param {Array} messages 
 * @returns {Object} 
 */
export const fetchDataFromGrok = async (messages) => {
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile", 
    });
    return completion.choices[0]?.message?.content; 
  } catch (error) {
    console.error("Error fetching data from Groq:", error);
    throw error;
  }
};
