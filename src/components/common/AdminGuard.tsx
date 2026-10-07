'use client'

import NotFound from '@/app/not-found'
import { useIsAdmin } from '@/hooks/use-admin-session'
import React from 'react'

interface AdminGuardProps {
  children: React.ReactNode
  type?: 'page' | 'element'
}

const AdminGuard = ({ children, type = 'element' }: AdminGuardProps) => {
  const isAdmin = useIsAdmin()

  if (!isAdmin) {
    return type === 'page' ? <NotFound /> : null
  }

  return <>{children}</>
}

export default AdminGuard
