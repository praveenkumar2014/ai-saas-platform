import { NextRequest, NextResponse } from 'next/server'

const API_VERSIONS = ['v1'] as const
const DEFAULT_VERSION = 'v1'

export function getAPIVersion(request: NextRequest): string {
  // Check URL path for version
  const url = new URL(request.url)
  const pathParts = url.pathname.split('/')
  
  // Look for version in path (e.g., /api/v1/...)
  const versionIndex = pathParts.findIndex((part) => part.startsWith('v'))
  if (versionIndex !== -1) {
    const version = pathParts[versionIndex]
    if (API_VERSIONS.includes(version as any)) {
      return version
    }
  }

  // Check header
  const headerVersion = request.headers.get('api-version')
  if (headerVersion && API_VERSIONS.includes(headerVersion as any)) {
    return headerVersion
  }

  return DEFAULT_VERSION
}

export function withAPIVersion(handler: (request: NextRequest, version: string) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const version = getAPIVersion(request)
    return handler(request, version)
  }
}

export function createVersionedResponse<T>(data: T, version: string = DEFAULT_VERSION) {
  return NextResponse.json({
    data,
    meta: {
      version,
      timestamp: new Date().toISOString(),
    },
  })
}

export function createErrorResponse(error: string, status: number = 400, version: string = DEFAULT_VERSION) {
  return NextResponse.json(
    {
      error,
      meta: {
        version,
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  )
}
