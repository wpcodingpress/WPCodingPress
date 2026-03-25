export interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  basicPrice: number
  standardPrice: number
  premiumPrice: number
  basicFeatures: string[]
  standardFeatures: string[]
  premiumFeatures: string[]
  order: number
  isActive: boolean
}

export interface Order {
  id: string
  serviceId: string
  service?: Service
  packageType: 'basic' | 'standard' | 'premium'
  clientName: string
  clientEmail: string
  clientPhone: string
  message?: string
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  isRead: boolean
  createdAt: Date
}

export interface Portfolio {
  id: string
  title: string
  category: string
  imageUrl: string
  description?: string
  order: number
  isActive: boolean
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  order: number
  isActive: boolean
}

export type PackageType = 'basic' | 'standard' | 'premium'

export interface OrderFormData {
  serviceId: string
  packageType: PackageType
  clientName: string
  clientEmail: string
  clientPhone: string
  message?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}
