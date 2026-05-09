import { Section, Text } from '@react-email/components'
import BaseLayout from '../../layouts/BaseLayout'

interface NewUserSignupAlertProps {
  userName?: string
  userEmail?: string
  createdAt?: string
}

export default function NewUserSignupAlert({
  userName,
  userEmail,
  createdAt,
}: NewUserSignupAlertProps) {
  return (
    <BaseLayout
      previewText={`New user signup: ${userEmail || 'unknown'}`}
      title="New User Registration"
    >
      <Text style={paragraphStyle}>Admin Alert,</Text>
      <Text style={paragraphStyle}>
        A new user has registered on WPCodingPress.
      </Text>
      <Section style={detailsBoxStyle}>
        <Text style={detailRowStyle}>
          <strong>Name:</strong> {userName || 'N/A'}
        </Text>
        <Text style={detailRowStyle}>
          <strong>Email:</strong> {userEmail || 'N/A'}
        </Text>
        {createdAt && (
          <Text style={detailRowStyle}>
            <strong>Registered:</strong> {createdAt}
          </Text>
        )}
      </Section>
    </BaseLayout>
  )
}

const paragraphStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '8px 0',
}

const detailsBoxStyle: React.CSSProperties = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const detailRowStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '4px 0',
}
