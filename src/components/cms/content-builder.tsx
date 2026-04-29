'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Save, 
  FolderKanban,
  FileText,
  Layout,
  Settings,
  Eye
} from 'lucide-react'

interface Field {
  id: string
  name: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'boolean' | 'image' | 'rich-text'
  label: string
  required: boolean
}

interface ContentModel {
  id: string
  name: string
  description: string
  fields: Field[]
}

export default function ContentBuilder() {
  const [models, setModels] = useState<ContentModel[]>([
    {
      id: '1',
      name: 'Blog Post',
      description: 'Blog post content model',
      fields: [
        { id: 'f1', name: 'title', type: 'text', label: 'Title', required: true },
        { id: 'f2', name: 'content', type: 'rich-text', label: 'Content', required: true },
        { id: 'f3', name: 'excerpt', type: 'textarea', label: 'Excerpt', required: false },
        { id: 'f4', name: 'featuredImage', type: 'image', label: 'Featured Image', required: false },
        { id: 'f5', name: 'publishedAt', type: 'date', label: 'Published Date', required: false },
      ],
    },
  ])
  const [selectedModel, setSelectedModel] = useState<ContentModel | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const fieldTypes = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'textarea', label: 'Textarea', icon: FileText },
    { id: 'rich-text', label: 'Rich Text', icon: Layout },
    { id: 'number', label: 'Number', icon: FileText },
    { id: 'date', label: 'Date', icon: FileText },
    { id: 'boolean', label: 'Boolean', icon: Settings },
    { id: 'image', label: 'Image', icon: FolderKanban },
  ]

  const addField = (type: Field['type']) => {
    if (!selectedModel) return

    const newField: Field = {
      id: `f${Date.now()}`,
      name: `field_${selectedModel.fields.length + 1}`,
      type,
      label: `Field ${selectedModel.fields.length + 1}`,
      required: false,
    }

    setSelectedModel({
      ...selectedModel,
      fields: [...selectedModel.fields, newField],
    })
  }

  const removeField = (fieldId: string) => {
    if (!selectedModel) return

    setSelectedModel({
      ...selectedModel,
      fields: selectedModel.fields.filter((f) => f.id !== fieldId),
    })
  }

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    if (!selectedModel) return

    setSelectedModel({
      ...selectedModel,
      fields: selectedModel.fields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    })
  }

  const saveModel = () => {
    if (!selectedModel) return

    setModels((prev) =>
      prev.map((m) => (m.id === selectedModel.id ? selectedModel : m))
    )
    alert('Model saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Models List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            Content Models
          </CardTitle>
          <CardDescription>
            Manage your content models and schemas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedModel?.id === model.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {model.fields.length} fields
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
                    <p className="text-sm text-muted-foreground">Create Model</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Model Editor */}
      {selectedModel && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  {selectedModel.name}
                </CardTitle>
                <CardDescription>{selectedModel.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button size="sm" onClick={saveModel}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isPreviewMode ? (
              <>
                {/* Field Type Selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Add Field</label>
                  <div className="flex flex-wrap gap-2">
                    {fieldTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addField(type.id as Field['type'])}
                      >
                        <type.icon className="h-4 w-4 mr-2" />
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Fields List */}
                <div className="space-y-4">
                  {selectedModel.fields.map((field) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-border/40 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            updateField(field.id, { label: e.target.value })
                          }
                          placeholder="Field Label"
                          className="max-w-xs"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Field Name
                          </label>
                          <Input
                            value={field.name}
                            onChange={(e) =>
                              updateField(field.id, { name: e.target.value })
                            }
                            placeholder="field_name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Type
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              updateField(field.id, { type: e.target.value as Field['type'] })
                            }
                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {fieldTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={field.required}
                          onChange={(e) =>
                            updateField(field.id, { required: e.target.checked })
                          }
                          className="rounded border-input"
                        />
                        <label
                          htmlFor={`required-${field.id}`}
                          className="text-sm"
                        >
                          Required field
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Content Preview</p>
                  <p className="text-sm">
                    This is how the content form will appear for this model
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
