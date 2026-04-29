import { Metadata } from 'next'

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
  noIndex?: boolean
}

export function generateMetadata(data: SEOMetadata): Metadata {
  const { title, description, keywords, ogImage, canonical, noIndex } = data

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    icons: {
      icon: 'https://www.gsgroups.net/gslogo.png',
      apple: 'https://www.gsgroups.net/gslogo.png',
    },
  }

  if (canonical) {
    metadata.alternates = {
      canonical,
    }
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}

export function generateDynamicMetadata(
  title: string,
  description: string,
  additionalData?: {
    keywords?: string[]
    ogImage?: string
    canonical?: string
  }
): Metadata {
  const baseTitle = 'AI SaaS Platform'
  const fullTitle = `${title} | ${baseTitle}`

  return generateMetadata({
    title: fullTitle,
    description,
    keywords: additionalData?.keywords,
    ogImage: additionalData?.ogImage || 'https://www.gsgroups.net/gslogo.png',
    canonical: additionalData?.canonical,
  })
}

export function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3)

  const frequency: Record<string, number> = {}
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1
  })

  const sortedWords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word)

  return sortedWords
}

export function generateDescription(content: string, maxLength: number = 160): string {
  const cleanContent = content.replace(/\s+/g, ' ').trim()
  
  if (cleanContent.length <= maxLength) {
    return cleanContent
  }

  const truncated = cleanContent.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}
