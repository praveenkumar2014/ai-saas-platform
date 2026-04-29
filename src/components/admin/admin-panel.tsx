'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  FileText, 
  Activity,
  Search,
  MoreVertical,
  Ban,
  CheckCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react'

type AdminTab = 'users' | 'analytics' | 'cms' | 'settings'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'cms' as AdminTab, label: 'CMS', icon: FileText },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ]

  const mockUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'ADMIN', status: 'active', createdAt: new Date() },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'USER', status: 'active', createdAt: new Date() },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'USER', status: 'suspended', createdAt: new Date() },
  ]

  const analytics = {
    totalUsers: 2847,
    activeUsers: 2156,
    revenue: 45230,
    growth: 23,
  }

  const renderUsersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-10"
          />
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Manage Roles
        </Button>
      </div>

      <div className="border border-border/40 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Joined</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-t border-border/40">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 text-xs ${
                    user.status === 'active' ? 'text-green-500' : 
                    user.status === 'suspended' ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    {user.status === 'active' && <CheckCircle className="h-3 w-3" />}
                    {user.status === 'suspended' && <Ban className="h-3 w-3" />}
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+23%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.growth}%</div>
            <p className="text-xs text-muted-foreground">
              Month over month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>Daily active users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Analytics chart placeholder</p>
              <p className="text-sm">Connect to analytics provider</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCMSTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Content Management</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Models</CardTitle>
          <CardDescription>Manage your content schemas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No content models yet</p>
            <p className="text-sm">Create your first content model to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Configure your platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Platform Name</label>
            <Input defaultValue="AI SaaS Platform" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Support Email</label>
            <Input defaultValue="support@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Default User Role</label>
            <select className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your platform</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border/40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'cms' && renderCMSTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </motion.div>
    </div>
  )
}
