import { prisma } from './prisma'
import { Role } from '../generated/prisma/enums'

export interface PermissionCheck {
  resource: string
  action: string
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) return false

  // Super Admin has all permissions
  if (user.role === Role.SUPER_ADMIN) return true

  // Check if the role has the specific permission
  const rolePermission = await prisma.rolePermission.findFirst({
    where: {
      role: user.role,
      permission: {
        resource,
        action,
      },
    },
  })

  return !!rolePermission
}

/**
 * Check if a user has any of the specified permissions
 */
export async function hasAnyPermission(
  userId: string,
  permissions: PermissionCheck[]
): Promise<boolean> {
  const results = await Promise.all(
    permissions.map((p) => hasPermission(userId, p.resource, p.action))
  )
  return results.some((r) => r)
}

/**
 * Check if a user has all of the specified permissions
 */
export async function hasAllPermissions(
  userId: string,
  permissions: PermissionCheck[]
): Promise<boolean> {
  const results = await Promise.all(
    permissions.map((p) => hasPermission(userId, p.resource, p.action))
  )
  return results.every((r) => r)
}

/**
 * Get all permissions for a user's role
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) return []

  // Super Admin has all permissions
  if (user.role === Role.SUPER_ADMIN) {
    const allPermissions = await prisma.permission.findMany()
    return allPermissions.map((p) => `${p.resource}:${p.action}`)
  }

  const rolePermissions = await prisma.rolePermission.findMany({
    where: { role: user.role },
    include: { permission: true },
  })

  return rolePermissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`)
}

/**
 * Initialize default permissions for all roles
 */
export async function initializeDefaultPermissions(): Promise<void> {
  const resources = ['users', 'content', 'workflows', 'ai', 'payments', 'analytics', 'settings']
  const actions = ['create', 'read', 'update', 'delete', 'manage']

  // Create all permissions
  for (const resource of resources) {
    for (const action of actions) {
      await prisma.permission.upsert({
        where: {
          resource_action: {
            resource,
            action,
          },
        },
        update: {},
        create: {
          name: `${resource}:${action}`,
          resource,
          action,
          description: `Permission to ${action} ${resource}`,
        },
      })
    }
  }

  // Assign permissions to roles
  const permissions = await prisma.permission.findMany()

  // Super Admin - all permissions
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_permissionId: {
          role: Role.SUPER_ADMIN,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        role: Role.SUPER_ADMIN,
        permissionId: permission.id,
      },
    })
  }

  // Admin - content, workflows, ai, analytics (no users, payments, settings)
  const adminResources = ['content', 'workflows', 'ai', 'analytics']
  for (const permission of permissions) {
    if (adminResources.includes(permission.resource)) {
      await prisma.rolePermission.upsert({
        where: {
          role_permissionId: {
            role: Role.ADMIN,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          role: Role.ADMIN,
          permissionId: permission.id,
        },
      })
    }
  }

  // User - read only on content, limited ai
  const userPermissions = permissions.filter(
    (p) => (p.resource === 'content' && p.action === 'read') || (p.resource === 'ai' && p.action === 'read')
  )
  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_permissionId: {
          role: Role.USER,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        role: Role.USER,
        permissionId: permission.id,
      },
    })
  }
}
