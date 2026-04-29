'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Trash2, 
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

interface WorkflowTask {
  id: string
  name: string
  description: string
  status: TaskStatus
  startedAt?: Date
  completedAt?: Date
  result?: any
  error?: string
}

interface Workflow {
  id: string
  name: string
  description: string
  tasks: WorkflowTask[]
  isActive: boolean
}

export default function WorkflowEngine() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Content Generation Pipeline',
      description: 'Automated content generation workflow',
      isActive: true,
      tasks: [
        { id: 't1', name: 'Generate Ideas', description: 'AI-powered idea generation', status: 'completed' },
        { id: 't2', name: 'Create Content', description: 'Generate content from ideas', status: 'running' },
        { id: 't3', name: 'Review & Edit', description: 'Human review and editing', status: 'pending' },
        { id: 't4', name: 'Publish', description: 'Publish to platforms', status: 'pending' },
      ],
    },
  ])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0])
  const [isCreating, setIsCreating] = useState(false)

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />
      case 'cancelled':
        return <Square className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-muted'
      case 'running':
        return 'bg-primary/20 border-primary'
      case 'completed':
        return 'bg-green-500/20 border-green-500'
      case 'failed':
        return 'bg-destructive/20 border-destructive'
      case 'cancelled':
        return 'bg-muted'
    }
  }

  const runWorkflow = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              tasks: w.tasks.map((t, i) => ({
                ...t,
                status: i === 0 ? 'running' : 'pending',
                startedAt: i === 0 ? new Date() : undefined,
              })),
            }
          : w
      )
    )
  }

  const pauseWorkflow = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              tasks: w.tasks.map((t) =>
                t.status === 'running' ? { ...t, status: 'pending' } : t
              ),
            }
          : w
      )
    )
  }

  const stopWorkflow = (workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              tasks: w.tasks.map((t) =>
                t.status === 'running' || t.status === 'pending'
                  ? { ...t, status: 'cancelled' }
                  : t
              ),
            }
          : w
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Workflows
          </CardTitle>
          <CardDescription>
            Manage your automated workflows and task pipelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {workflows.map((workflow) => (
              <motion.div
                key={workflow.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedWorkflow?.id === workflow.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedWorkflow(workflow)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <div className="flex gap-1">
                        {workflow.tasks.filter((t) => t.status === 'running').length > 0 && (
                          <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {workflow.tasks.filter((t) => t.status === 'completed').length} / {workflow.tasks.length} completed
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="cursor-pointer border-dashed hover:border-primary/50">
                <CardHeader className="p-4 flex items-center justify-center h-full min-h-[100px]">
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Create Workflow</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Details */}
      {selectedWorkflow && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  {selectedWorkflow.name}
                </CardTitle>
                <CardDescription>{selectedWorkflow.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pauseWorkflow(selectedWorkflow.id)}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => stopWorkflow(selectedWorkflow.id)}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
                <Button
                  size="sm"
                  onClick={() => runWorkflow(selectedWorkflow.id)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Task Pipeline */}
            <div className="space-y-4">
              {selectedWorkflow.tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < selectedWorkflow.tasks.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border/40" />
                  )}

                  <div
                    className={`flex gap-4 p-4 rounded-lg border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-background flex items-center justify-center border">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{task.name}</h4>
                        <span className="text-xs text-muted-foreground capitalize">
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.description}
                      </p>
                      {task.startedAt && (
                        <p className="text-xs text-muted-foreground">
                          Started: {task.startedAt.toLocaleTimeString()}
                        </p>
                      )}
                      {task.completedAt && (
                        <p className="text-xs text-muted-foreground">
                          Completed: {task.completedAt.toLocaleTimeString()}
                        </p>
                      )}
                      {task.error && (
                        <p className="text-xs text-destructive mt-1">{task.error}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updatedTasks = [...selectedWorkflow.tasks]
                        updatedTasks.splice(index, 1)
                        setSelectedWorkflow({
                          ...selectedWorkflow,
                          tasks: updatedTasks,
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Task Button */}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                if (!selectedWorkflow) return
                const newTask: WorkflowTask = {
                  id: `t${Date.now()}`,
                  name: 'New Task',
                  description: 'Task description',
                  status: 'pending',
                }
                setSelectedWorkflow({
                  ...selectedWorkflow,
                  tasks: [...selectedWorkflow.tasks, newTask],
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
