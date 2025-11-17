const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Resources Agent
async function resourcesAgent(action, data) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `You are a helpful educational resources management agent. 
  Action: ${action}
  Data: ${JSON.stringify(data)}
  
  Provide a helpful response or analysis based on the action and data provided.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Agent is currently unavailable. Please try again later.';
  }
}

// Report Generation Agent
async function reportGenerationAgent(responses) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `You are a feedback analysis agent. Analyze the following anonymous student feedback responses about a faculty member and generate a comprehensive, constructive report.
  
  Feedback Responses:
  ${JSON.stringify(responses, null, 2)}
  
  Generate a detailed report that:
  1. Summarizes the overall feedback
  2. Highlights strengths
  3. Identifies areas for improvement
  4. Provides actionable suggestions
  5. Maintains a constructive and professional tone
  
  Format the report in a clear, structured manner.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Report generation failed. Please try again later.';
  }
}

// Library Agent
async function libraryAgent(action, data) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `You are a library management assistant agent. 
  Action: ${action}
  Data: ${JSON.stringify(data)}
  
  Provide helpful information about books, availability, recommendations, or library services.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Library agent is currently unavailable.';
  }
}

// Menu Agent
async function menuAgent(action, data) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `You are a campus dining assistant agent managing canteen and mess menus.
  Action: ${action}
  Data: ${JSON.stringify(data)}
  
  Provide helpful information about menus, items, or dining services.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Menu agent is currently unavailable.';
  }
}

module.exports = {
  resourcesAgent,
  reportGenerationAgent,
  libraryAgent,
  menuAgent
};

