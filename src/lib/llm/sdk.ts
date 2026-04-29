import OpenAI from 'openai'

export interface LLMProvider {
  id: string
  name: string
  type: 'openai' | 'ollama' | 'anthropic' | 'local'
  models: LLMModel[]
}

export interface LLMModel {
  id: string
  name: string
  provider: string
  contextWindow?: number
  maxTokens?: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionOptions {
  model: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export class LLMClient {
  private openai: OpenAI | null = null
  private ollamaBaseUrl: string

  constructor() {
    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  }

  getProviders(): LLMProvider[] {
    const providers: LLMProvider[] = []

    // OpenAI
    if (this.openai) {
      providers.push({
        id: 'openai',
        name: 'OpenAI',
        type: 'openai',
        models: [
          { id: 'gpt-4', name: 'GPT-4', provider: 'openai', contextWindow: 8192, maxTokens: 4096 },
          { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', contextWindow: 128000, maxTokens: 4096 },
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', contextWindow: 16385, maxTokens: 4096 },
        ],
      })
    }

    // Ollama (Local)
    providers.push({
      id: 'ollama',
      name: 'Ollama (Local)',
      type: 'ollama',
      models: [
        { id: 'llama2', name: 'Llama 2', provider: 'ollama', contextWindow: 4096 },
        { id: 'mistral', name: 'Mistral', provider: 'ollama', contextWindow: 8192 },
        { id: 'codellama', name: 'Code Llama', provider: 'ollama', contextWindow: 16384 },
      ],
    })

    return providers
  }

  async chatCompletion(options: ChatCompletionOptions): Promise<string> {
    const { model, messages, temperature = 0.7, maxTokens = 2048 } = options

    // Check if it's an OpenAI model
    if (this.openai && model.startsWith('gpt-')) {
      try {
        const response = await this.openai.chat.completions.create({
          model,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          temperature,
          max_tokens: maxTokens,
        })

        return response.choices[0]?.message?.content || ''
      } catch (error) {
        console.error('OpenAI API error:', error)
        throw new Error('Failed to generate completion with OpenAI')
      }
    }

    // Check if it's an Ollama model
    if (model.includes('llama') || model.includes('mistral') || model.includes('codellama')) {
      try {
        const response = await fetch(`${this.ollamaBaseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            options: {
              temperature,
              num_predict: maxTokens,
            },
          }),
        })

        const data = await response.json()
        return data.message?.content || ''
      } catch (error) {
        console.error('Ollama API error:', error)
        throw new Error('Failed to generate completion with Ollama')
      }
    }

    throw new Error(`Unknown model: ${model}`)
  }

  async streamChatCompletion(
    options: ChatCompletionOptions,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const { model, messages, temperature = 0.7, maxTokens = 2048 } = options

    // OpenAI streaming
    if (this.openai && model.startsWith('gpt-')) {
      try {
        const stream = await this.openai.chat.completions.create({
          model,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          temperature,
          max_tokens: maxTokens,
          stream: true,
        })

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            onChunk(content)
          }
        }
      } catch (error) {
        console.error('OpenAI streaming error:', error)
        throw new Error('Failed to stream completion with OpenAI')
      }
    } else {
      // Fallback to non-streaming for other providers
      const content = await this.chatCompletion(options)
      onChunk(content)
    }
  }

  async listModels(): Promise<LLMModel[]> {
    const models: LLMModel[] = []

    // Get OpenAI models
    if (this.openai) {
      try {
        const response = await this.openai.models.list()
        models.push(
          ...response.data
            .filter((m) => m.id.startsWith('gpt-'))
            .map((m) => ({
              id: m.id,
              name: m.id,
              provider: 'openai',
            }))
        )
      } catch (error) {
        console.error('Failed to list OpenAI models:', error)
      }
    }

    // Get Ollama models
    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/tags`)
      const data = await response.json()
      models.push(
        ...(data.models || []).map((m: any) => ({
          id: m.name,
          name: m.name,
          provider: 'ollama',
        }))
      )
    } catch (error) {
      console.error('Failed to list Ollama models:', error)
    }

    return models
  }
}

// Singleton instance
let llmClientInstance: LLMClient | null = null

export function getLLMClient(): LLMClient {
  if (!llmClientInstance) {
    llmClientInstance = new LLMClient()
  }
  return llmClientInstance
}
