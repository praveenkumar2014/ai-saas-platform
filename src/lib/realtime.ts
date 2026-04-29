export interface RealtimeMessage {
  id: string
  channel: string
  event: string
  data: unknown
  timestamp: Date
}

export class RealtimeManager {
  private channels: Map<string, Set<(message: RealtimeMessage) => void>> = new Map()
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor() {
    this.connect()
  }

  private connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

    try {
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data)
          const callbacks = this.channels.get(message.channel)
          if (callbacks) {
            callbacks.forEach((callback) => callback(message))
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.reconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      this.reconnect()
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
      setTimeout(() => this.connect(), 5000)
    }
  }

  subscribe(channelName: string, callback: (message: RealtimeMessage) => void) {
    if (!this.channels.has(channelName)) {
      this.channels.set(channelName, new Set())
    }
    this.channels.get(channelName)!.add(callback)

    // Send subscription message
    this.send({
      type: 'subscribe',
      channel: channelName,
    })
  }

  unsubscribe(channelName: string, callback: (message: RealtimeMessage) => void) {
    const callbacks = this.channels.get(channelName)
    if (callbacks) {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        this.channels.delete(channelName)
        this.send({
          type: 'unsubscribe',
          channel: channelName,
        })
      }
    }
  }

  broadcast(channelName: string, event: string, data: unknown) {
    this.send({
      type: 'broadcast',
      channel: channelName,
      event,
      data,
    })
  }

  private send(message: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  disconnectAll() {
    this.channels.clear()
    if (this.ws) {
      this.ws.close()
    }
  }
}

// Singleton instance
let realtimeManagerInstance: RealtimeManager | null = null

export function getRealtimeManager(): RealtimeManager {
  if (!realtimeManagerInstance) {
    realtimeManagerInstance = new RealtimeManager()
  }
  return realtimeManagerInstance
}
