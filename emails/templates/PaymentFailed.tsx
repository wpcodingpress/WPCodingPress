import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import AlertBox from '../components/AlertBox'
import CTAButton from '../components/CTAButton'

interface PaymentFailedProps {
  userName?: string
  amount?: number
  currency?: string
  planDisplay?: string
  dashboardUrl?: string
}

export default function PaymentFailed({
  userName,
  amount,
  currency,
  planDisplay,
  dashboardUrl,
}: PaymentFailedProps) {
  const formattedAmount = amount
    ? `${currency || '$'}${amount}`
    : ''

  return (
    <BaseLayout
      previewText="Payment failed - action required"
      title="Payment Failed"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <AlertBox
        type="error"
        message="We were unable to process your payment. Please update your payment method to avoid service interruption."
      />
      <Text style={paragraphStyle}>
        Your payment of <strong>{formattedAmount}</strong>
        {planDisplay ? ` for ${planDisplay}` : ''} could not be processed.
      </Text>
      <Section style={ctaContainerStyle}>
        <CTAButton href={dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`}>
          Update Payment Method
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
