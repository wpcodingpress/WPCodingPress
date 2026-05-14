import type { FormAdapterConfig, DetectedForm, FormField } from './types'
import type { FeatureMap } from '@/lib/engine'
import type { WPExportRaw } from '@/lib/engine/types'

const FORM_PLUGINS = [
  'contact-form-7', 'wpforms', 'gravityforms', 'formidable', 'ninja-forms',
  'caldera-forms', 'elementor-pro', 'visual-form-builder', 'happyforms',
  'everest-forms', 'weforms', 'fluentform', 'forminator',
]

export function detectFormsConfig(wpRaw: WPExportRaw, features: FeatureMap): FormAdapterConfig {
  const plugins = (wpRaw.plugins as string[]) || []
  const activePlugins = plugins.filter(p => !p.startsWith('inactive:'))
  const detectedPlugin = activePlugins.find(p => FORM_PLUGINS.some(fp => p.toLowerCase().includes(fp))) || null

  const rawForms = (wpRaw.forms as Array<Record<string, unknown>>) || []
  const forms: DetectedForm[] = rawForms.map((f) => ({
    id: String(f.id || ''),
    title: String(f.title || 'Untitled Form'),
    fields: parseFormFields(f.fields as Array<Record<string, unknown>> || []),
    submitLabel: String(f.submit_label || f.submit || 'Submit'),
    successMessage: String(f.success_message || f.confirmation_message || 'Thank you!'),
  }))

  if (!features.hasForms && forms.length === 0) {
    return {
      enabled: false,
      forms: [],
      captchaEnabled: false,
      detectedPlugin: null,
    }
  }

  if (forms.length === 0) {
    forms.push({
      id: 'default-contact',
      title: 'Contact Form',
      fields: [
        { type: 'text', label: 'Name', name: 'name', required: true, placeholder: 'Your name' },
        { type: 'email', label: 'Email', name: 'email', required: true, placeholder: 'your@email.com' },
        { type: 'textarea', label: 'Message', name: 'message', required: true, placeholder: 'Your message...' },
      ],
      submitLabel: 'Send Message',
      successMessage: 'Thank you for your message!',
    })
  }

  return {
    enabled: true,
    forms,
    captchaEnabled: activePlugins.some(p =>
      p.toLowerCase().includes('recaptcha') || p.toLowerCase().includes('captcha')
    ),
    detectedPlugin,
  }
}

function parseFormFields(rawFields: Array<Record<string, unknown>>): FormField[] {
  if (!Array.isArray(rawFields) || rawFields.length === 0) {
    return [
      { type: 'text', label: 'Name', name: 'name', required: true, placeholder: 'Your name' },
      { type: 'email', label: 'Email', name: 'email', required: true, placeholder: 'your@email.com' },
      { type: 'textarea', label: 'Message', name: 'message', required: true, placeholder: 'Your message...' },
    ]
  }

  return rawFields.map((f) => ({
    type: (f.type as FormField['type']) || 'text',
    label: String(f.label || ''),
    name: String(f.name || f.label || ''),
    required: Boolean(f.required),
    placeholder: String(f.placeholder || ''),
    options: Array.isArray(f.options) ? f.options.map(String) : undefined,
  }))
}
