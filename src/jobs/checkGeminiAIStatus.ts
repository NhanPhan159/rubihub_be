import { connectToAI, logger } from "../utils";

export const activeAIWhenFailed = async () => {
    try {
        connectToAI();
    } catch (error) {
        logger.error("Failed to connect to AI");
        // retry to connect to AI
        setTimeout(() => {
            activeAIWhenFailed();
        }, 5000);
    }
}
