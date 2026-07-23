import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    // Configure OpenAI SDK to hit NVIDIA NIM endpoint
    this.openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || 'MISSING_API_KEY',
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
  }

  async processMessage(message: string): Promise<string> {
    try {
      // 1. Fetch live rating tables to inject into the system prompt
      // This grounds the AI in reality so it doesn't hallucinate prices.
      const bikes = await this.prisma.vehicleModel.findMany({ take: 5 });
      const insurers = await this.prisma.partner.findMany({ where: { type: 'INSURER' }, take: 5 });
      
      const contextStr = `
Current Market Data (Do not hallucinate outside of this):
Top Bikes: ${bikes.map(b => `${b.brand} ${b.name} (${b.cc}cc) - Base Premium: NPR ${b.basePremium}`).join(', ')}
Top Insurers: ${insurers.map(i => `${i.name} (Claim Ratio: ${i.claimRatio}%, Branches: ${i.branches})`).join(', ')}
`;

      const systemPrompt = `You are NepaBot, the official AI insurance advisor for NepaCompare (Nepal's leading insurance aggregator).
Your goal is to answer customer questions accurately, instantly provide quotes based on the context provided, and collect lead information (like phone number) when they are ready to buy.
You must be extremely concise, helpful, and professional. 

${contextStr}

If a user asks a question you don't know the answer to, tell them an agent will call them and ask for their phone number.`;

      // 2. Call the NVIDIA Llama 3.1 70B model (or any NVIDIA NIM model)
      const completion = await this.openai.chat.completions.create({
        model: 'meta/llama-3.1-70b-instruct', // NVIDIA NIM endpoint model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.2,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || "I'm having trouble processing that right now.";
    } catch (error) {
      console.error("AI Error:", error);
      return "Sorry, I am currently experiencing high volume. Please leave your phone number and an agent will call you back immediately.";
    }
  }
}
