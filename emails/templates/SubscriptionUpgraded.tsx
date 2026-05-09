import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import StatusBadge from '../components/StatusBadge'
import CTAButton from '../components/CTAButton'

interface SubscriptionUpgradedProps {
  userName?: string
  planDisplay?: string
  dashboardUrl?: string
}

export default function SubscriptionUpgraded({
  userName,
  planDisplay,
  dashboardUrl,
}: SubscriptionUpgradedProps) {
  return (
    <BaseLayout
      previewText={`Upgraded to ${planDisplay || 'new'} plan!`}
      title="Plan Upgraded!"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <StatusBadge status="success" label="UPGRADED" />
      <Text style={paragraphStyle}>
        Congratulations! You have been upgraded to the{' '}
        <strong>{planDisplay || 'new'}</strong> plan.
      </Text>
      <Text style={paragraphStyle}>
        You now have access to additional features and higher limits.
      </Text>
      <Section style={ctaContainerStyle}>
        <CTAButton href={dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
          Explore New Features
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
