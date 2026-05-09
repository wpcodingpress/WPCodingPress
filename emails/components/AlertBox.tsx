import { Section, Text } from '@react-email/components'

interface AlertBoxProps {
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
}

const colors: Record<string, { bg: string; border: string; text: string }> = {
  success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46' },
  warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
  error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
}

export default function AlertBox({ type, message }: AlertBoxProps) {
  const { bg, border, text } = colors[type] || colors.info

  return (
    <Section
      style={{
        ...alertStyle,
        backgroundColor: bg,
        borderColor: border,
      }}
    >
      <Text style={{ ...alertTextStyle, color: text }}>{message}</Text>
    </Section>
  )
}

const alertStyle: React.CSSProperties = {
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid',
  margin: '16px 0',
}

const alertTextStyle: React.CSSProperties = {
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.5',
}
