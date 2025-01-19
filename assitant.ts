import { IOpenAIApi, ThreadId } from "./openAIApi";
import { Assistant as OpenAIAssistant } from "openai/resources/beta/assistants";
import { Thread, ThreadCreateParams } from "./thread";

export type AssistantCreateParams = {
    model: string;
    description: string;
    instructions: string;
    name: string;
    // temperature: number;
    // tool_resources?: OpenAIAssistantCreateParams.ToolResources | null;
}

export async function createAssistant(api: IOpenAIApi, params: AssistantCreateParams): Promise<Assistant> {
    const openAiAssistant = await api.createAssistant(params);
    const assistant = new Assistant(api, openAiAssistant);
    return assistant;
}

export class Assistant {

    private threads: Map<ThreadId, Thread> = new Map();

    constructor(private api: IOpenAIApi,
        private assistant: OpenAIAssistant) {

    }

    public getId(): string {
        return this.assistant.id;
    }

    public getThread(threadId: ThreadId): Thread | undefined {
        return this.threads.get(threadId);
    }

    public async createThread(params: ThreadCreateParams): Promise<Thread> {
        const createThread = await this.api.createThread(params);
        const thread = new Thread(this.api, createThread);
        this.threads.set(this.assistant.id, thread);
        return thread;
    }

    public async deleteThread(threadId: ThreadId): Promise<void> {
        if (this.threads.has(threadId)) {
            await this.api.deleteThread(threadId);
            this.threads.delete(threadId);
        }
    }
}