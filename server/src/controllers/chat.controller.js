import { Conversation } from '../models/Conversation.js';
import { Activity } from '../models/Activity.js';
import { buildUserAIContext } from '../services/ai/context.service.js';
import { generateAIChatResponse } from '../services/ai/ai.service.js';
import { getAssistantChatPrompt } from '../services/ai/prompt.service.js';

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .select('title createdAt updatedAt messages')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      user: req.user._id,
      title: title || 'Nexus Career Strategy Session',
      messages: [],
    });

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, user: req.user._id });
    }

    if (!conversation) {
      const firstWords = content.substring(0, 30);
      conversation = await Conversation.create({
        user: req.user._id,
        title: `${firstWords}...`,
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content,
      contextIncluded: true,
    });

    // Build unified user AI context
    const userContext = await buildUserAIContext(req.user._id);

    // Format chat system prompt
    const systemPrompt = getAssistantChatPrompt(userContext, conversation.messages, content);

    // Fallback response generator if API key is not present or API call fails
    const fallbackResponse = `Based on your profile as an aspiring **${userContext.profile?.targetRoles?.[0] || 'Software Professional'}**, here is my Nexus AI intelligence analysis:

### Key Takeaways for Your Profile
1. **Current Skill Base**: You have logged skills including \`${(userContext.skills || []).slice(0, 4).join(', ') || 'Core Programming'}\`.
2. **Recommended Action**: To strengthen your profile readiness (currently at **${userContext.profile?.readinessScore || 70}%**), prioritize mastering **Docker containerization**, **System Design fundamentals**, and building a end-to-end full-stack portfolio item.
3. **Next Steps**:
   - Update your latest resume score on the **Resume Intelligence** tab.
   - Run a live job description match on the **Job Match** tab to isolate exact gaps.

Feel free to ask follow-up questions regarding salary expectations, interview preparation, or project ideas!`;

    const assistantMessageContent = await generateAIChatResponse(systemPrompt, fallbackResponse);

    // Add assistant response
    conversation.messages.push({
      role: 'assistant',
      content: assistantMessageContent,
      contextIncluded: true,
    });

    await conversation.save();

    await Activity.create({
      user: req.user._id,
      activityType: 'CHAT_SESSION',
      title: 'Consulted Nexus AI Assistant',
      description: `Topic: "${content.substring(0, 40)}..."`,
    });

    res.json({
      success: true,
      data: {
        conversation,
        reply: conversation.messages[conversation.messages.length - 1],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    await Conversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({
      success: true,
      message: 'Conversation deleted',
    });
  } catch (error) {
    next(error);
  }
};
