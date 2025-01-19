
export type AssistantParams = {
    model: string;
    description: string;
    instructions: string;
    name: string;
    // temperature: number;
    // tool_resources?: OpenAIAssistantCreateParams.ToolResources | null;
}


export class RestApi {
    constructor(private serverUrl: string) {
    }

    async getAssistantList(): Promise<string[]> {
        try {
            const assistantList = await fetch(`${this.serverUrl}/assistant_list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const list = await assistantList.json();
            return list;
        } catch (error) {
            console.error(`Can\'t get assistant list ${error}`);
            throw error;
        }
    }

    async createAssistant(params: AssistantParams): Promise<string> {
        try {

            const newAssistantResponse = await fetch(`${this.serverUrl}/assistant_create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ params }),
            });

            const newAssistantId = await newAssistantResponse.json();
            return newAssistantId;
        } catch (error) {
            console.error('Error creating assistant:', error);
            throw error;
        }
    }

    async getAssistant(): Promise<string> {
        try {
            const response = await fetch(`${this.serverUrl}/assistants`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error retrieving assistant:', error);
            throw error;
        }
    }

    async deleteAssistant(assistantId: string): Promise<void> {
        try {
            const response = await fetch(`/assistants/${assistantId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    async createThread(assistantId: string): Promise<string> {
        try {
            const url = `${this.serverUrl}/threads`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assistantId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error creating thread:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const responseData = await response.text();
            return responseData;
        } catch (error) {
            throw error;
        }
    }

    async deleteThread(threadId: string): Promise<void> {
        try {
            const response = await fetch(`/threads/${threadId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    async createMessage(threadId: string, message: string): Promise<string> {
        const url = `${this.serverUrl}/messages`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ threadId, message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    }

    async getResponse(threadId: string): Promise<string> {
        console.log('Thread ID:', threadId);
        const url = `${this.serverUrl}/threads/${threadId}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseBody = await response.text();
        return responseBody;
    }

    async deleteMessage(threadId: string, messageId: string): Promise<Boolean> {
        const response = await fetch(`${this.serverUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ threadId, messageId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
    }
}

