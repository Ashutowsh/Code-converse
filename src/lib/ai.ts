import {GoogleGenerativeAI} from "@google/generative-ai"
import env from "./env"

const genAI = new GoogleGenerativeAI(env.ai.apiKey)