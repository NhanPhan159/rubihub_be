import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import configs from "../configs";
import { logger } from "./logger";

const MODEL_NAME = configs.AI_GENERATIVE.MODEL_NAME;
const API_KEY = configs.AI_GENERATIVE.API_KEY;
const generationConfig = configs.GEMINI_CONFIG.GENERATION_CONFIG;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // Add other safety categories as needed
];

export const connectToAI = () => {
    const aiModel = genAI.getGenerativeModel({ model: MODEL_NAME });

    const AIChat = aiModel.startChat({
        generationConfig,
        safetySettings,
        history: configs.GEMINI_CONFIG.HISTORY,
    });

    logger.info("AI connection established successfully.");
    console.info("AI connection established successfully.");
    return AIChat;
};
