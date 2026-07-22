import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  /**
   * TODO: Connect to OpenAI or Google Gemini here!
   * 
   * Example integration:
   * const response = await openai.chat.completions.create({
   *   model: "gpt-4",
   *   messages: [{ role: "user", content: message }],
   * });
   * return response.choices[0].message.content;
   */
  async processMessage(message: string): Promise<string> {
    const lowerMsg = message.toLowerCase();
    
    // Simulated AI Keyword Matching for the MVP
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return "Hello! I am NepaBot, your AI assistant. How can I help you find the perfect insurance policy today?";
    }
    
    if (lowerMsg.includes('motor') || lowerMsg.includes('bike') || lowerMsg.includes('car')) {
      return "For motor insurance, we compare comprehensive and third-party plans from top insurers like Shikhar and Neco. You can head over to our 'Get a Quote' page to see instant prices based on your vehicle's CC!";
    }
    
    if (lowerMsg.includes('health') || lowerMsg.includes('medical')) {
      return "Health insurance is crucial. We offer policies that cover hospitalization, critical illness, and OPD. The premium usually depends on your age and the sum assured. Would you like a personalized quote?";
    }

    if (lowerMsg.includes('claim') || lowerMsg.includes('help')) {
      return "If you need to file a claim, you can do it right from your Digital Locker! Just upload a photo or video of the incident, and our ClaimSetu AI will fast-track the verification.";
    }

    if (lowerMsg.includes('deductible') || lowerMsg.includes('excess')) {
      return "A deductible (or compulsory excess) is the amount you pay out-of-pocket before your insurance covers the rest. Higher deductibles usually mean lower premiums!";
    }

    if (lowerMsg.includes('third party') || lowerMsg.includes('comprehensive')) {
      return "Third-party insurance only covers damages to others. Comprehensive covers both third-party liabilities AND damages to your own vehicle. Comprehensive is highly recommended for new vehicles.";
    }

    if (lowerMsg.includes('webgpu') || lowerMsg.includes('speed') || lowerMsg.includes('fast')) {
      return "I am currently running on our new WebGPU-accelerated backend! This means my inference speed is up to 10x faster, so I can answer your complex insurance queries instantly.";
    }

    if (lowerMsg.includes('human') || lowerMsg.includes('agent') || lowerMsg.includes('call')) {
      return "I can have one of our licensed human advisors call you immediately. Please provide your phone number.";
    }

    return "I'm still learning! While I can't answer that perfectly yet, our expert advisors are available. Let me know if you'd like me to schedule a call for you, or feel free to try another question about our insurance products!";
  }
}
