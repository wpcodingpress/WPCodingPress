import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import StatusBadge from '../components/StatusBadge'
import CTAButton from '../components/CTAButton'

interface SubscriptionActivatedProps {
  userName?: string
  planDisplay?: string
  billingCycle?: string
  dashboardUrl?: string
}

export default function SubscriptionActivated({
  userName,
  planDisplay,
  billingCycle,
  dashboardUrl,
}: SubscriptionActivatedProps) {
  return (
    <BaseLayout
      previewText={`${planDisplay || 'Subscription'} plan activated!`}
      title="Subscription Activated"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <StatusBadge status="success" label="ACTIVE" />
      <Text style={paragraphStyle}>
        Your <strong>{planDisplay || 'subscription'}</strong> plan
        {billingCycle ? ` (${billingCycle} billing)` : ''} is now active!
      </Text>
      <Text style={paragraphStyle}>
        You now have full access to all features included in your plan.
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
