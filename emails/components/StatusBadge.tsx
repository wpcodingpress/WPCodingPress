import { Text } from '@react-email/components'

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info'
  label: string
}

const colors: Record<string, { bg: string; text: string }> = {
  success: { bg: '#d1fae5', text: '#065f46' },
  warning: { bg: '#fef3c7', text: '#92400e' },
  error: { bg: '#fee2e2', text: '#991b1b' },
  info: { bg: '#dbeafe', text: '#1e40af' },
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const { bg, text } = colors[status] || colors.info

  return (
    <Text
      style={{
        ...badgeStyle,
        backgroundColor: bg,
        color: text,
      }}
    >
      {label}
    </Text>
  )
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '6px 16px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  margin: '8px 0',
}
