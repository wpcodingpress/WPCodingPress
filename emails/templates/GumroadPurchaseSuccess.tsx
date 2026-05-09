import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import CTAButton from '../components/CTAButton'

interface GumroadPurchaseSuccessProps {
  userName?: string
  productName?: string
  planName?: string
  planDisplay?: string
  amount?: number
  currency?: string
  onboardingUrl?: string
}

export default function GumroadPurchaseSuccess({
  userName,
  productName,
  planName,
  planDisplay,
  amount,
  currency,
  onboardingUrl,
}: GumroadPurchaseSuccessProps) {
  const planLabel = planDisplay || planName || productName || 'Subscription'

  return (
    <BaseLayout
      previewText={`Thank you for your ${planLabel} purchase!`}
      title="Purchase Successful!"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        Thank you for your purchase of <strong>{planLabel}</strong>
        {amount ? ` for ${currency || '$'}${amount}` : ''}! We are excited to get started.
      </Text>
      <Text style={headingStyle}>What Happens Next:</Text>
      <ol style={listStyle}>
        <li style={listItemStyle}>
          <strong>Complete Your Onboarding</strong> — Tell us about your project
        </li>
        <li style={listItemStyle}>
          <strong>Project Discussion</strong> — Your project manager will reach out within 24 hours
        </li>
        <li style={listItemStyle}>
          <strong>Design & Development</strong> — Our team gets to work on your website
        </li>
        <li style={listItemStyle}>
          <strong>Launch</strong> — Your site goes live
        </li>
      </ol>
      {onboardingUrl && (
        <Section style={ctaContainerStyle}>
          <CTAButton href={onboardingUrl}>Complete Onboarding</CTAButton>
        </Section>
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

const headingStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '20px 0 8px',
}

const listStyle: React.CSSProperties = {
  paddingLeft: '24px',
  margin: '8px 0',
}

const listItemStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.8',
  color: '#4b5563',
  margin: '4px 0',
}

const ctaContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0',
}
