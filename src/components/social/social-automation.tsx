'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import {
  Share2,
  Calendar,
  MessageSquare,
  Send,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'

type SocialPlatform = 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'youtube'

interface SocialPost {
  id: string
  platform: SocialPlatform
  content: string
  mediaUrls: string[]
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: Date
  publishedAt?: Date
  postId?: string
  metrics?: {
    likes: number
    shares: number
    comments: number
    views: number
  }
}

export default function SocialAutomation() {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      platform: 'twitter',
      content: 'Excited to announce our new AI-powered platform! 🚀 #AI #SaaS',
      mediaUrls: [],
      status: 'draft',
    },
    {
      id: '2',
      platform: 'linkedin',
      content: 'We are revolutionizing the way businesses work with AI. Join us on this journey.',
      mediaUrls: [],
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 86400000),
    },
  ])
  const [isPublishing, setIsPublishing] = useState(false)

  const platforms = [
    { id: 'twitter' as SocialPlatform, label: 'Twitter', icon: MessageSquare, color: 'text-blue-400' },
    { id: 'facebook' as SocialPlatform, label: 'Facebook', icon: MessageSquare, color: 'text-blue-600' },
    { id: 'linkedin' as SocialPlatform, label: 'LinkedIn', icon: MessageSquare, color: 'text-blue-700' },
    { id: 'instagram' as SocialPlatform, label: 'Instagram', icon: MessageSquare, color: 'text-pink-600' },
    { id: 'youtube' as SocialPlatform, label: 'YouTube', icon: MessageSquare, color: 'text-red-600' },
  ]

  const getStatusIcon = (status: SocialPost['status']) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4 text-muted-foreground" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const publishPost = async (postId: string) => {
    setIsPublishing(true)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, status: 'published', publishedAt: new Date() } : p
      )
    )

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPublishing(false)
  }

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Create Post
          </CardTitle>
          <CardDescription>
            Schedule and publish content across multiple platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Platform</label>
            <div className="flex gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <platform.icon className={`h-4 w-4 ${platform.color}`} />
                  {platform.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <textarea
              placeholder="Write your post content..."
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Schedule (optional)</label>
            <Input type="datetime-local" />
          </div>

          <div className="flex gap-2">
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Publish Now
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline">
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>Manage your social media posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => {
              const platform = platforms.find((p) => p.id === post.platform)
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border/40 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {platform && <platform.icon className={`h-5 w-5 ${platform.color}`} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{platform?.label}</span>
                          {getStatusIcon(post.status)}
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">{post.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm">{post.content}</p>

                  {post.scheduledAt && (
                    <p className="text-xs text-muted-foreground">
                      Scheduled for: {post.scheduledAt.toLocaleString()}
                    </p>
                  )}

                  {post.publishedAt && (
                    <p className="text-xs text-muted-foreground">
                      Published at: {post.publishedAt.toLocaleString()}
                    </p>
                  )}

                  {post.status === 'draft' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => publishPost(post.id)} disabled={isPublishing}>
                        {isPublishing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Publish
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
