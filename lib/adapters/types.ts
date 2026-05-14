export interface AuthAdapterConfig {
  enabled: boolean
  provider: 'next-auth' | 'firebase' | 'supabase' | 'custom' | null
  pages: {
    login: string
    register: string
    forgotPassword: string
    profile: string
  }
  socialProviders: string[]
  registrationEnabled: boolean
  detectedPlugins: string[]
}

export interface FormAdapterConfig {
  enabled: boolean
  forms: DetectedForm[]
  captchaEnabled: boolean
  detectedPlugin: string | null
}

export interface DetectedForm {
  id: string
  title: string
  fields: FormField[]
  submitLabel: string
  successMessage: string
}

export interface FormField {
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'tel' | 'number'
  label: string
  name: string
  required: boolean
  placeholder: string
  options?: string[]
}

export interface SearchAdapterConfig {
  enabled: boolean
  type: 'wordpress' | 'algolia' | 'meilisearch' | 'elastic' | 'custom' | null
  liveSearch: boolean
  filtersEnabled: boolean
  searchPage: string | null
}

export interface WooCommerceAdapterConfig {
  enabled: boolean
  features: {
    products: boolean
    cart: boolean
    checkout: boolean
    myAccount: boolean
    reviews: boolean
    categories: boolean
    tags: boolean
    relatedProducts: boolean
    wishlist: boolean
  }
  currency: string
  productCount: number
  hasVariations: boolean
  productPage: string
  cartPage: string
  checkoutPage: string
}

export interface FeatureAdapterResult {
  auth: AuthAdapterConfig
  forms: FormAdapterConfig
  search: SearchAdapterConfig
  woocommerce: WooCommerceAdapterConfig
  detectedFeatures: string[]
}
