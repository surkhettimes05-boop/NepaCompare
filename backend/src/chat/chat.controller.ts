import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() body: ChatDto) {
    if (!body.message) {
      return { response: "Please say something!" };
    }
    
    // Simulate a slight network delay to make the AI feel "real" and show the typing indicator
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = await this.chatService.processMessage(body.message);
    
    return { response };
  }
}
