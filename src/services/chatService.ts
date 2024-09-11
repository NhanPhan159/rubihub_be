import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import configs from '../configs';

const MODEL_NAME = configs.AI_GENERATIVE.MODEL_NAME;
const API_KEY = configs.AI_GENERATIVE.API_KEY;

export const chatResponse = async (userInput: string) => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.6, // Set to a more reasonable value to maintain response quality
    topK: 1,
    topP: 0.5,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: 'user',
        parts: [
          {
            text: 'You are an advanced English language assistant for intermediate students at a B2+ level, adding little advanced words. Your role is to help them brainstorm ideas, provide examples, and offer clear explanations for vocabulary, collocations, idioms, phrasal verbs, and slang. Always provide clear and concise explanations and limit your responses to three examples. Include some friendly emojis to make the conversation engaging. Ensure your responses are relevant to the questions asked and maintain context.',
          },
        ],
      },
      {
        role: 'user',
        parts: [{ text: 'What do you do in your free time?' }],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'Here\'s how you can answer that question:\n\n1. Jogging: "I often go jogging every Sunday 🏃‍♂️"\n   - Collocation: go jogging\n\n2. Reading: "I love reading mystery novels in my free time 📚"\n   - Idiom: lose yourself in a book\n\n3. Cooking: "I enjoy cooking new recipes every weekend 🍳"\n   - Phrasal verb: try out new recipes',
          },
        ],
      },
      {
        role: 'user',
        parts: [{ text: "What's your favorite thing about your hometown?" }],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'Here are some ways to answer that question:\n\n1. Community: "I love the sense of community in my hometown. Everyone knows each other and helps out 🤝"\n   - Collocation: sense of community\n\n2. Scenery: "The beautiful scenery is my favorite thing. The landscapes are breathtaking 🌄"\n   - Collocation: beautiful scenery\n\n3. Festivals: "The local festivals are amazing. They bring everyone together and are a lot of fun 🎉"\n   - Collocation: local festivals',
          },
        ],
      },
      {
        role: 'user',
        parts: [{ text: 'How do you prepare for exams?' }],
      },
      {
        role: 'model',
        parts: [
          {
            text: 'Here are some tips on how to prepare for exams:\n\n1. Study Plan: "I create a study plan to organize my time effectively 📅"\n   - Collocation: create a study plan\n\n2. Practice Tests: "I take practice tests to get familiar with the exam format 📝"\n   - Collocation: take practice tests\n\n3. Healthy Habits: "I make sure to get enough sleep and eat healthy to stay focused 🛌🍎"\n   - Collocation: healthy habits',
          },
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  const text = response.text();
  return text;
};
