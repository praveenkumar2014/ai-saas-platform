'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { 
  FileCode, 
  Folder, 
  Plus, 
  Save, 
  Play, 
  Settings, 
  Trash2,
  Download,
  Upload,
  Sparkles,
  Loader2
} from 'lucide-react'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  language?: string
}

export default function AIIDE() {
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: '2',
          name: 'app',
          type: 'folder',
          children: [
            { id: '3', name: 'page.tsx', type: 'file', content: 'export default function Page() {\n  return <div>Hello World</div>\n}', language: 'typescript' },
            { id: '4', name: 'layout.tsx', type: 'file', content: 'export default function Layout({ children }) {\n  return <html><body>{children}</body></html>\n}', language: 'typescript' },
          ],
        },
        {
          id: '5',
          name: 'components',
          type: 'folder',
          children: [
            { id: '6', name: 'Button.tsx', type: 'file', content: 'export function Button({ children }) {\n  return <button>{children}</button>\n}', language: 'typescript' },
          { id: '7', name: 'Card.tsx', type: 'file', content: 'export function Card({ children }) {\n  return <div className="card">{children}</div>\n}', language: 'typescript' },
          ],
        },
      ],
    },
  ])
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedFile?.type === 'file' && selectedFile.content) {
      setFileContent(selectedFile.content)
    }
  }, [selectedFile])

  const findFileNode = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findFileNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  const updateFileContent = (id: string, content: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === id && node.type === 'file') {
          return { ...node, content }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }
    setFiles(updateNode(files))
  }

  const handleSave = () => {
    if (selectedFile?.type === 'file') {
      updateFileContent(selectedFile.id, fileContent)
      alert('File saved!')
    }
  }

  const handleGenerateCode = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert code generator. Generate clean, production-ready code based on the user prompt.',
            },
            {
              role: 'user',
              content: aiPrompt,
            },
          ],
          model: 'gpt-4',
        }),
      })

      const data = await response.json()
      
      if (data.content) {
        setFileContent((prev) => prev + '\n' + data.content)
      }
    } catch (error) {
      console.error('Error generating code:', error)
      alert('Failed to generate code')
    } finally {
      setIsGenerating(false)
    }
  }

  const createFile = (parentId: string) => {
    const newNode: FileNode = {
      id: `f${Date.now()}`,
      name: 'newFile.tsx',
      type: 'file',
      content: '',
      language: 'typescript',
    }

    const addToParent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId && node.type === 'folder') {
          return { ...node, children: [...(node.children || []), newNode] }
        }
        if (node.children) {
          return { ...node, children: addToParent(node.children) }
        }
        return node
      })
    }

    setFiles(addToParent(files))
    setSelectedFile(newNode)
  }

  const createFolder = (parentId: string) => {
    const newNode: FileNode = {
      id: `f${Date.now()}`,
      name: 'newFolder',
      type: 'folder',
      children: [],
    }

    const addToParent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId && node.type === 'folder') {
          return { ...node, children: [...(node.children || []), newNode] }
        }
        if (node.children) {
          return { ...node, children: addToParent(node.children) }
        }
        return node
      })
    }

    setFiles(addToParent(files))
  }

  const deleteNode = (id: string) => {
    const removeFromNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter((node) => node.id !== id).map((node) => ({
        ...node,
        children: node.children ? removeFromNodes(node.children) : undefined,
      }))
    }

    setFiles(removeFromNodes(files))
    if (selectedFile?.id === id) {
      setSelectedFile(null)
      setFileContent('')
    }
  }

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-accent ${
            selectedFile?.id === node.id ? 'bg-accent' : ''
          }`}
          onClick={() => {
            if (node.type === 'file') {
              setSelectedFile(node)
            }
          }}
        >
          {node.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-500" />
          ) : (
            <FileCode className="h-4 w-4 text-green-500" />
          )}
          <span className="text-sm">{node.name}</span>
          {node.type === 'folder' && (
            <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation()
                  createFile(node.id)
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        {node.children && renderFileTree(node.children, level + 1)}
      </div>
    ))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <FileCode className="h-5 w-5 text-primary" />
          <span className="font-semibold">AI IDE</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const rootId = files[0]?.id
              if (rootId) createFile(rootId)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New File
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const rootId = files[0]?.id
              if (rootId) createFolder(rootId)
            }}
          >
            <Folder className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r border-border/40 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Explorer</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                const rootId = files[0]?.id
                if (rootId) createFolder(rootId)
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {renderFileTree(files)}
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              {/* Editor Header */}
              <div className="flex items-center justify-between p-2 border-b border-border/40 bg-muted/50">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => deleteNode(selectedFile.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              {/* AI Assistant Panel */}
              <Card className="m-4">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Code Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe what code you want to generate..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleGenerateCode()
                      }
                    }}
                  />
                  <Button
                    onClick={handleGenerateCode}
                    disabled={!aiPrompt.trim() || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Code Editor */}
              <div className="flex-1 p-4">
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="w-full h-full font-mono text-sm bg-muted/50 border border-input rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Start coding or use AI to generate code..."
                  spellCheck={false}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to start editing</p>
                <p className="text-sm">Or create a new file to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
