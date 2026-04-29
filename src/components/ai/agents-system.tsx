'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import {
  Bot,
  Code,
  PenTool,
  Megaphone,
  Zap,
  Plus,
  Settings,
  Play,
  Pause,
  Trash2
} from 'lucide-react'

type AgentType = 'code' | 'content' | 'marketing' | 'automation' | 'custom'

interface Agent {
  id: string
  name: string
  type: AgentType
  description: string
  systemPrompt: string
  model: string
  isActive: boolean
  config: Record<string, any>
}

export default function AgentsSystem() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Code Assistant',
      type: 'code',
      description: 'AI-powered code generation and debugging assistant',
      systemPrompt: 'You are an expert coding assistant. Help users write, debug, and optimize code.',
      model: 'gpt-4',
      isActive: true,
      config: { language: 'typescript', framework: 'nextjs' },
    },
    {
      id: '2',
      name: 'Content Creator',
      type: 'content',
      description: 'Generate engaging content for blogs, social media, and marketing',
      systemPrompt: 'You are a creative content writer. Create engaging, SEO-optimized content.',
      model: 'gpt-4-turbo',
      isActive: true,
      config: { tone: 'professional', style: 'engaging' },
    },
    {
      id: '3',
      name: 'Marketing Agent',
      type: 'marketing',
      description: 'Create marketing campaigns and ad copy',
      systemPrompt: 'You are a marketing expert. Create compelling marketing materials and campaigns.',
      model: 'gpt-4',
      isActive: false,
      config: { industry: 'saas', targetAudience: 'developers' },
    },
  ])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0])
  const [isCreating, setIsCreating] = useState(false)

  const agentTypes = [
    { id: 'code' as AgentType, label: 'Code', icon: Code, description: 'Code generation and debugging' },
    { id: 'content' as AgentType, label: 'Content', icon: PenTool, description: 'Content creation and writing' },
    { id: 'marketing' as AgentType, label: 'Marketing', icon: Megaphone, description: 'Marketing and campaigns' },
    { id: 'automation' as AgentType, label: 'Automation', icon: Zap, description: 'Task automation' },
    { id: 'custom' as AgentType, label: 'Custom', icon: Bot, description: 'Custom agent' },
  ]

  const getAgentIcon = (type: AgentType) => {
    const agentType = agentTypes.find((t) => t.id === type)
    return agentType?.icon || Bot
  }

  const toggleAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId ? { ...a, isActive: !a.isActive } : a
      )
    )
  }

  const deleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== agentId))
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null)
    }
  }

  const saveAgent = () => {
    if (!selectedAgent) return
    setAgents((prev) =>
      prev.map((a) => (a.id === selectedAgent.id ? selectedAgent : a))
    )
    alert('Agent saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Agents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Agents
          </CardTitle>
          <CardDescription>
            Manage your AI-powered agents for different tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${selectedAgent?.id === agent.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                    }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${agent.isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                          {React.createElement(getAgentIcon(agent.type), { className: 'h-4 w-4' })}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <CardDescription className="text-xs capitalize">
                            {agent.type} Agent
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleAgent(agent.id)
                          }}
                        >
                          {agent.isActive ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="cursor-pointer border-dashed hover:border-primary/50">
                <CardHeader className="p-4 flex items-center justify-center h-full min-h-[100px]">
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Create Agent</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Editor */}
      {selectedAgent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  {selectedAgent.name}
                </CardTitle>
                <CardDescription>{selectedAgent.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAgent(selectedAgent.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button size="sm" onClick={saveAgent}>
                  <Settings className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Agent Name</label>
                <Input
                  value={selectedAgent.name}
                  onChange={(e) =>
                    setSelectedAgent({ ...selectedAgent, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Agent Type</label>
                <select
                  value={selectedAgent.type}
                  onChange={(e) =>
                    setSelectedAgent({ ...selectedAgent, type: e.target.value as AgentType })
                  }
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {agentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                value={selectedAgent.description}
                onChange={(e) =>
                  setSelectedAgent({ ...selectedAgent, description: e.target.value })
                }
                placeholder="Describe what this agent does"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">System Prompt</label>
              <textarea
                value={selectedAgent.systemPrompt}
                onChange={(e) =>
                  setSelectedAgent({ ...selectedAgent, systemPrompt: e.target.value })
                }
                placeholder="Define the agent's behavior and instructions"
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Model</label>
              <select
                value={selectedAgent.model}
                onChange={(e) =>
                  setSelectedAgent({ ...selectedAgent, model: e.target.value })
                }
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`active-${selectedAgent.id}`}
                checked={selectedAgent.isActive}
                onChange={(e) =>
                  setSelectedAgent({ ...selectedAgent, isActive: e.target.checked })
                }
                className="rounded border-input"
              />
              <label htmlFor={`active-${selectedAgent.id}`} className="text-sm">
                Agent is active
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
