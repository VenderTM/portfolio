import OpenAI from 'openai';
import { Assistant, AssistantCreateParams, AssistantDeleted, AssistantListParams, AssistantsPage, AssistantUpdateParams } from 'openai/resources/beta/assistants';
import { ILogger } from '../../../common/logger';
import { Thread, ThreadCreateParams, ThreadDeleted, ThreadUpdateParams } from 'openai/resources/beta/threads/threads';
import { Message, MessageCreateParams, MessageDeleted, MessageListParams, MessagesPage, MessageUpdateParams } from 'openai/resources/beta/threads/messages';

export type ThreadId = string;
export type AssistantId = string;
export type MessageId = string;

export interface IOpenAIApi {
    createAssistant(params: AssistantCreateParams): Promise<Assistant>;
    listOfAssistants(params: AssistantListParams): Promise<AssistantsPage>;
    retrieveAssistant(assistantId: AssistantId): Promise<Assistant>;
    updateAssistant(assistantId: AssistantId, params: AssistantUpdateParams): Promise<Assistant>;
    deleteAssistant(assistantId: AssistantId): Promise<AssistantDeleted>;
    createThread(params: ThreadCreateParams): Promise<Thread>;
    retrieveThread(threadId: ThreadId): Promise<Thread>;
    updateThread(threadId: ThreadId, params: ThreadUpdateParams): Promise<Thread>;
    deleteThread(threadId: ThreadId): Promise<ThreadDeleted>;
    createMessage(params: MessageCreateParams, threadId: ThreadId): Promise<Message>;
    listOfMessages(threadId: ThreadId, params: MessageListParams): Promise<MessagesPage>
    retrieveMessage(threadId: ThreadId, messageId: MessageId): Promise<Message>;
    updateMessage(threadId: ThreadId, messageId: MessageId, params: MessageUpdateParams): Promise<Message>;
    deleteMessage(threadId: ThreadId, messageId: MessageId): Promise<MessageDeleted>;
}

export class OpenAIApi implements IOpenAIApi {
    private openai: OpenAI;

    constructor(private logger: ILogger) {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    public async createAssistant(params: AssistantCreateParams): Promise<Assistant> {
        this.logger.info('Creating assistant with parameters');
        const newAssitant = await this.openai.beta.assistants.create(params);
        this.logger.info(`Created assistant: ${newAssitant}`);
        return newAssitant;
    }

    public async listOfAssistants(params: AssistantListParams): Promise<AssistantsPage> {
        this.logger.info('Getting list of assistants');
        const assistantList = await this.openai.beta.assistants.list(params);
        this.logger.log(`List of assistants has been created: ${assistantList}`);
        return assistantList;
    }

    public async retrieveAssistant(assistantId: AssistantId): Promise<Assistant> {
        this.logger.info(`Retrieving assistant with ID: ${assistantId}`);
        const assistant = await this.openai.beta.assistants.retrieve(assistantId);
        this.logger.info(`Retrieved assistant: ${assistant}`);
        return assistant;
    }

    public async updateAssistant(assistantId: AssistantId, params: AssistantUpdateParams): Promise<Assistant> {
        this.logger.info(`Updating assistant with ID: ${assistantId}`);
        const assistantUpdated = await this.openai.beta.assistants.update(assistantId, params);
        this.logger.info(`Updated assistant: ${assistantUpdated}`);
        return assistantUpdated;
    }

    public async deleteAssistant(assistantId: AssistantId): Promise<AssistantDeleted> {
        this.logger.info(`Deleting assistant with ID: ${assistantId}`);
        const assistantUtilization = await this.openai.beta.assistants.del(assistantId);
        this.logger.info(`Assistant with id: ${assistantUtilization} was deleted successfully!`);
        return assistantUtilization;
    }

    public async createThread(params: ThreadCreateParams): Promise<Thread> {
        this.logger.info('Creating thread');
        const createThread = await this.openai.beta.threads.create(params);
        this.logger.info(`Created thread: ${createThread}`);
        return createThread;
    }

    public async retrieveThread(threadId: ThreadId): Promise<Thread> {
        this.logger.info(`Retrieving thread with ID: ${threadId}`);
        const retrieveThread = await this.openai.beta.threads.retrieve(threadId);
        this.logger.info(`Retrieved thread: ${retrieveThread}`);
        return retrieveThread;
    }

    public async updateThread(threadId: ThreadId, params: ThreadUpdateParams): Promise<Thread> {
        this.logger.info(`Updating thread with ID: ${threadId}`);
        const updateThread = await this.openai.beta.threads.update(threadId, params);
        this.logger.info(`Updated thread: ${updateThread}`);
        return updateThread;
    }

    public async deleteThread(threadId: ThreadId): Promise<ThreadDeleted> {
        this.logger.info(`Deleting thread with ID: ${threadId}`);
        const deleteThread = await this.openai.beta.threads.del(threadId);
        this.logger.info(`Deleted thread: ${deleteThread}`);
        return deleteThread;
    }

    public async createMessage(params: MessageCreateParams, threadId: ThreadId): Promise<Message> {
        this.logger.info(`Creating message in thread with ID: ${threadId}`);
        const createMessages = await this.openai.beta.threads.messages.create(threadId, params);
        this.logger.info(`Message parameters: ${params}`);
        return createMessages;
    }
    public async listOfMessages(threadId: ThreadId, params: MessageListParams): Promise<MessagesPage> {
        this.logger.info(`Retrieving messages in thread with ID: ${threadId}`);
        const messageList = await this.openai.beta.threads.messages.list(threadId, params);
        this.logger.info(`Retrieved messages: ${messageList}`);
        return messageList;
    }

    public async retrieveMessage(threadId: ThreadId, messageId: MessageId): Promise<Message> {
        this.logger.info(`Retrieving message with ID: ${messageId}`);
        const retriveMessages = await this.openai.beta.threads.messages.retrieve(threadId, messageId);
        this.logger.info(`Retrieved message: ${retriveMessages}`);
        return retriveMessages;
    }

    public async updateMessage(threadId: ThreadId, messageId: MessageId, params: MessageUpdateParams):
        Promise<Message> {
        this.logger.info(`Updating message with ID: ${messageId}`);
        const updateMessages = await this.openai.beta.threads.messages.update(threadId, messageId, params);
        this.logger.info(`Updated message: ${updateMessages}`);
        return updateMessages;
    }

    public async deleteMessage(threadId: ThreadId, messageId: MessageId): Promise<MessageDeleted> {
        this.logger.info(`Deleting message with ID: ${messageId}`);
        const deleteMessages = await this.openai.beta.threads.messages.del(threadId, messageId);
        this.logger.info(`Deleted message: ${deleteMessages}`);
        return deleteMessages;
    }
}
