import { Section, Text } from '@react-email/components'
import BaseLayout from '../../layouts/BaseLayout'
import AlertBox from '../../components/AlertBox'

interface SuspiciousActivityAlertProps {
  userName?: string
  userEmail?: string
  ipAddress?: string
  location?: string
  device?: string
}

export default function SuspiciousActivityAlert({
  userName,
  userEmail,
  ipAddress,
  location,
  device,
}: SuspiciousActivityAlertProps) {
  return (
    <BaseLayout
      previewText="Suspicious activity detected"
      title="Suspicious Activity Detected"
    >
      <Text style={paragraphStyle}>Admin Alert,</Text>
      <AlertBox
        type="error"
        message="Suspicious activity has been detected on an account. Please investigate."
      />
      <Section style={detailsBoxStyle}>
        <Text style={detailRowStyle}>
          <strong>User:</strong> {userName || 'N/A'}
        </Text>
        <Text style={detailRowStyle}>
          <strong>Email:</strong> {userEmail || 'N/A'}
        </Text>
        {ipAddress && (
          <Text style={detailRowStyle}>
            <strong>IP Address:</strong> {ipAddress}
          </Text>
        )}
        {location && (
          <Text style={detailRowStyle}>
            <strong>Location:</strong> {location}
          </Text>
        )}
        {device && (
          <Text style={detailRowStyle}>
            <strong>Device:</strong> {device}
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
  backgroundColor: '#fef2f2',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #fecaca',
  margin: '16px 0',
}

const detailRowStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '4px 0',
}
