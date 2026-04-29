export interface UploadResult {
  url: string
  key: string
  etag?: string
}

export class StorageManager {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.STORAGE_API_URL || '/api/storage'
    this.apiKey = process.env.STORAGE_API_KEY || ''
  }

  async uploadFile(
    key: string,
    body: Buffer | string,
    contentType: string
  ): Promise<UploadResult> {
    // For now, return a mock URL. In production, integrate with actual S3-compatible storage
    const url = `${this.baseUrl}/${key}`

    return {
      url,
      key,
    }
  }

  async uploadFromUrl(
    key: string,
    url: string
  ): Promise<UploadResult> {
    // Fetch the file from URL
    const response = await fetch(url)
    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    return this.uploadFile(key, buffer, contentType)
  }

  async getFile(key: string): Promise<Buffer> {
    const response = await fetch(`${this.baseUrl}/${key}`)
    return Buffer.from(await response.arrayBuffer())
  }

  async deleteFile(key: string): Promise<void> {
    await fetch(`${this.baseUrl}/${key}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })
  }

  async deleteFiles(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.deleteFile(key)))
  }

  generateKey(prefix: string, filename: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    return `${prefix}/${timestamp}-${random}-${cleanFilename}`
  }
}

// Singleton instance
let storageManagerInstance: StorageManager | null = null

export function getStorageManager(): StorageManager {
  if (!storageManagerInstance) {
    storageManagerInstance = new StorageManager()
  }
  return storageManagerInstance
}
