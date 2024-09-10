import { chatResponse } from "../services";
import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
    try {
      const userInput = req.body?.userInput;
      if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
        return res.status(400).json({ error: 'Invalid request body. userInput cannot be empty.' });
      }
  
      const response = await chatResponse(userInput);
      res.status(200).json({ response });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router