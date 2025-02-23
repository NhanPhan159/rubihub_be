import { Router } from "express";
import { createQuestion } from "../services";
import Joi from "joi";
import { CreateQuestionData } from "../contracts/types/models/question";

const route = Router()

route.post("/",async (req,res,next)=>{
  const questionBody = req.body
  const validatedQuestion = await Joi.object<CreateQuestionData>({
    answerA: Joi.string().required(),
    answerB: Joi.string().required(),
    answerC: Joi.string().required(),
    answerD: Joi.string().required(),
    questionContent: Joi.string().required()
  }).validateAsync(questionBody)
  const data = await createQuestion(validatedQuestion)
  if(data)
    res.json({message: "create success!!!",data:data}).status(200)
})

export default route
