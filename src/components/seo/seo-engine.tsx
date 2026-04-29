'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import {
  Search,
  TrendingUp,
  BarChart3,
  Target,
  Sparkles,
  Copy,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'

interface KeywordSuggestion {
  keyword: string
  volume: number
  difficulty: number
  opportunity: number
}

interface SEOReport {
  score: number
  keywords: KeywordSuggestion[]
  suggestions: string[]
  viralPotential: number
}

export default function SEEngine() {
  const [content, setContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [report, setReport] = useState<SEOReport | null>(null)

  const mockKeywords: KeywordSuggestion[] = [
    { keyword: 'AI platform', volume: 12000, difficulty: 45, opportunity: 85 },
    { keyword: 'SaaS development', volume: 8500, difficulty: 52, opportunity: 78 },
    { keyword: 'machine learning tools', volume: 15000, difficulty: 38, opportunity: 92 },
    { keyword: 'automation software', volume: 9200, difficulty: 41, opportunity: 88 },
    { keyword: 'AI productivity', volume: 6800, difficulty: 35, opportunity: 90 },
  ]

  const analyzeSEO = async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setReport({
      score: 78,
      keywords: mockKeywords,
      suggestions: [
        'Add more long-tail keywords to improve ranking',
        'Include meta description for better click-through rates',
        'Optimize heading structure (H1, H2, H3)',
        'Add internal links to improve site structure',
        'Include alt text for images',
        'Improve content length to 1500+ words',
        'Add schema markup for rich snippets',
      ],
      viralPotential: 82,
    })

    setIsAnalyzing(false)
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 40) return 'text-green-500'
    if (difficulty < 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity > 80) return 'text-green-500'
    if (opportunity > 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Content Analyzer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            SEO Analyzer
          </CardTitle>
          <CardDescription>
            Analyze content and get SEO recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here to analyze..."
              className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <Button onClick={analyzeSEO} disabled={!content.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze SEO
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Report */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">{report.score}/100</div>
                <div className="flex-1">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${report.score >= 80 ? 'bg-green-500' :
                          report.score >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`}
                      style={{ width: `${report.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.score >= 80 ? 'Excellent' :
                      report.score >= 60 ? 'Good' :
                        'Needs Improvement'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Viral Potential: {report.viralPotential}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Keyword Suggestions
              </CardTitle>
              <CardDescription>
                Target keywords with volume and difficulty analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.keywords.map((keyword, index) => (
                  <motion.div
                    key={keyword.keyword}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{keyword.keyword}</div>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Volume: {keyword.volume.toLocaleString()}</span>
                        <span className={getDifficultyColor(keyword.difficulty)}>
                          Difficulty: {keyword.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${getOpportunityColor(keyword.opportunity)}`}>
                      {keyword.opportunity}% opportunity
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Recommendations
              </CardTitle>
              <CardDescription>
                Actionable suggestions to improve SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
