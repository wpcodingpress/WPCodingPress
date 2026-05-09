import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import CTAButton from '../components/CTAButton'

interface AccountUpdateProps {
  userName?: string
  changes?: string
  dashboardUrl?: string
}

export default function AccountUpdate({
  userName,
  changes,
  dashboardUrl,
}: AccountUpdateProps) {
  return (
    <BaseLayout
      previewText="Your account has been updated"
      title="Account Updated"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        Your WPCodingPress account has been updated successfully.
      </Text>
      {changes && (
        <Text style={paragraphStyle}>
          Changes made: <strong>{changes}</strong>
        </Text>
      )}
      <Text style={paragraphStyle}>
        If you did not make these changes, please contact our support team immediately.
      </Text>
      <Section style={ctaContainerStyle}>
        <CTAButton href={dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`}>
          Account Settings
        </CTAButton>
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

const ctaContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0',
}
