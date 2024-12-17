import { OpenAI } from 'openai';

let openaiInstance: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openaiInstance = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
  return openaiInstance;
};

export const getOpenAIInstance = () => {
  if (!openaiInstance) {
    throw new Error('OpenAI not initialized. Please provide an API key first.');
  }
  return openaiInstance;
};