'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Megaphone,
  Sparkles,
  Loader2,
  Download,
  Copy
} from 'lucide-react'

type ContentType = 'image' | 'post' | 'video' | 'ad'

export default function ContentStudio() {
  const [contentType, setContentType] = useState<ContentType>('image')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)

  const contentTypes = [
    { id: 'image' as ContentType, label: 'Image', icon: ImageIcon, description: 'Generate stunning images with AI' },
    { id: 'post' as ContentType, label: 'Social Post', icon: FileText, description: 'Create engaging social media posts' },
    { id: 'video' as ContentType, label: 'Video Script', icon: Video, description: 'Write compelling video scripts' },
    { id: 'ad' as ContentType, label: 'Advertisement', icon: Megaphone, description: 'Generate persuasive ad copy' },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(`Generated ${contentType} content based on: "${prompt}"`)
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent)
    }
  }

  const handleDownload = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-${contentType}-${Date.now()}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Content Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {contentTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all ${
                contentType === type.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setContentType(type.id)}
            >
              <CardHeader className="p-4">
                <type.icon className="h-8 w-8 mb-2" />
                <CardTitle className="text-lg">{type.label}</CardTitle>
                <CardDescription className={`text-xs ${
                  contentType === type.id ? 'text-primary-foreground/80' : ''
                }`}>
                  {type.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
          </CardTitle>
          <CardDescription>
            Describe what you want to create and let AI do the magic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe the ${contentType} you want to generate...`}
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
              </>
            )}
          </Button>

          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t border-border/40"
            >
              <div>
                <label className="text-sm font-medium mb-2 block">Generated Content</label>
                <div className="rounded-md border border-input bg-muted/50 p-4">
                  <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Recent Generations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
          <CardDescription>Your recently generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent generations yet</p>
            <p className="text-sm">Your generated content will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
