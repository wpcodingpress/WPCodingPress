import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import StatusBadge from '../components/StatusBadge'
import CTAButton from '../components/CTAButton'

interface FeatureAccessGrantedProps {
  userName?: string
  featureName?: string
  dashboardUrl?: string
}

export default function FeatureAccessGranted({
  userName,
  featureName,
  dashboardUrl,
}: FeatureAccessGrantedProps) {
  return (
    <BaseLayout
      previewText={`${featureName || 'New feature'} now available`}
      title="New Feature Available"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <StatusBadge status="success" label="ACCESS GRANTED" />
      <Text style={paragraphStyle}>
        You now have access to <strong>{featureName || 'a new feature'}</strong> on WPCodingPress.
      </Text>
      <Text style={paragraphStyle}>
        Log in to your dashboard to start using it right away.
      </Text>
      <Section style={ctaContainerStyle}>
        <CTAButton href={dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
          Go to Dashboard
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
