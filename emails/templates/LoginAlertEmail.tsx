import { Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import AlertBox from '../components/AlertBox'
import CTAButton from '../components/CTAButton'

interface LoginAlertEmailProps {
  userName?: string
  ipAddress?: string
  location?: string
  device?: string
  dashboardUrl?: string
}

export default function LoginAlertEmail({
  userName,
  ipAddress,
  location,
  device,
  dashboardUrl,
}: LoginAlertEmailProps) {
  return (
    <BaseLayout
      previewText="New sign-in to your account"
      title="New Sign-In Detected"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        A new sign-in was detected on your WPCodingPress account.
      </Text>
      <AlertBox
        type="info"
        message="If this was you, no action is needed. If you do not recognize this activity, please secure your account immediately."
      />
      <Text style={detailLabelStyle}>Sign-in details:</Text>
      {ipAddress && (
        <Text style={detailStyle}>
          IP Address: <strong>{ipAddress}</strong>
        </Text>
      )}
      {location && (
        <Text style={detailStyle}>
          Location: <strong>{location}</strong>
        </Text>
      )}
      {device && (
        <Text style={detailStyle}>
          Device: <strong>{device}</strong>
        </Text>
      )}
    </BaseLayout>
  )
}

const paragraphStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '8px 0',
}

const detailLabelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#374151',
  margin: '16px 0 4px',
}

const detailStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '2px 0',
}
