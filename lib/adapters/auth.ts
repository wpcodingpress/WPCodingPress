import type { AuthAdapterConfig } from './types'
import type { FeatureMap } from '@/lib/engine'
import type { WPExportRaw } from '@/lib/engine/types'

const AUTH_PLUGINS = [
  'wp-user-manager', 'ultimate-member', 'user-registration', 'wp-members',
  'members', 'simple-membership', 'paid-memberships-pro', 'restrict-content-pro',
  'wpforms-user-registration', 'woocommerce', 'buddyboss', 'peepso',
]

const SOCIAL_PLUGINS = [
  'nextend-facebook-connect', 'wordpress-social-login', 'social-login',
  'miniorange-oauth', 'wp-social', 'super-socializer',
]

export function detectAuthConfig(wpRaw: WPExportRaw, features: FeatureMap): AuthAdapterConfig {
  const plugins = (wpRaw.plugins as string[]) || []
  const activePlugins = plugins.filter(p => !p.startsWith('inactive:'))
  const detectedPlugins = activePlugins.filter(p => AUTH_PLUGINS.some(auth => p.toLowerCase().includes(auth)))
  const socialDetected = activePlugins.filter(p => SOCIAL_PLUGINS.some(s => p.toLowerCase().includes(s)))

  const hasRegistrationPlugin = detectedPlugins.length > 0
  const hasLogin = features.hasAuth || hasRegistrationPlugin
  const hasRegistration = features.hasRegistration || hasRegistrationPlugin

  const pages = {
    login: hasLogin ? '/login' : '/api/auth/signin',
    register: hasRegistration ? '/register' : '/api/auth/signup',
    forgotPassword: '/forgot-password',
    profile: '/profile',
  }

  return {
    enabled: hasLogin || hasRegistration,
    provider: hasLogin ? 'next-auth' : null,
    pages,
    socialProviders: socialDetected.length > 0 ? ['google', 'facebook'] : [],
    registrationEnabled: hasRegistration,
    detectedPlugins: [...detectedPlugins, ...socialDetected],
  }
}
