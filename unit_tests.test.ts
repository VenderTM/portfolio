import { Logger } from "../../common/logger";
import { Assistant, AssistantCreateParams, createAssistant } from "../src/openai/assistant";
import { OpenAIApi } from "../src/openai/openAIApi";
import { Assistant as OpenAIAssistant } from "openai/resources/beta/assistants";

import { Thread, ThreadCreateParams, ThreadDeleted } from "openai/resources/beta/threads/threads";

jest.mock('openai');

const createAssistantParams: AssistantCreateParams = {
    model: 'gpt-4o-mini',
    description: 'Test Assistant',
    instructions: 'You help children with math',
    name: 'Calculator',
    temperature: 0.7
}

const mockAssistant: OpenAIAssistant = {
    id: 'test-assistant',
    created_at: 25112024,
    description: 'Test Assistant',
    metadata: {},
    object: 'assistant',
    instructions: 'You are a test assistant',
    name: 'Test Assistant',
    tools: [{ type: 'code_interpreter' }],
    model: 'gpt-4o-mini'
};

const createThreadParams: ThreadCreateParams = {
    messages: [
        { role: 'user', content: 'Hello' }
    ],
    metadata: {},
    tool_resources: null
};

describe('createAssistant', () => {

    it('should create assistant', async () => {
        const openAIApi = new OpenAIApi(new Logger());
        jest.spyOn(openAIApi, 'createAssistant').mockResolvedValue(mockAssistant);
        const assistant = await createAssistant(openAIApi, createAssistantParams);
        expect(assistant.getId()).toEqual(mockAssistant.id);
    });
});

describe('Assistant', () => {

    describe('createThread', () => {
        it('should initialize thread', async () => {

            const mockThread: Thread = {
                id: "test-thread",
                created_at: 25112024,
                metadata: {},
                object: 'thread',
                tool_resources: null
            }

            const openAIApi = new OpenAIApi(new Logger());
            const assistant = new Assistant(openAIApi, mockAssistant);
            jest.spyOn(openAIApi, 'createThread').mockResolvedValue(mockThread);
            const thread = await assistant.createThread(createThreadParams);
            expect(thread.getId()).toEqual(mockThread.id);
        });
    });

    describe('deleteThread', () => {
        it('should delete thread', async () => {
            const mockThreadId = {
                id: 'test-thread'
            }

            const deletedThread: ThreadDeleted = {
                id: "test-thread",
                object: "thread.deleted",
                deleted: false
            }

            const openAIApi = new OpenAIApi(new Logger());
            const assistant = new Assistant(openAIApi, mockAssistant);
            jest.spyOn(openAIApi, 'deleteThread').mockResolvedValue(deletedThread);
            await assistant.deleteThread(mockThreadId.id);
            const thread = assistant.getThread(mockThreadId.id);
            expect(thread).toBeUndefined();
        });
    });
});