import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import StatusBadge from '../components/StatusBadge'
import CTAButton from '../components/CTAButton'

interface PaymentConfirmationProps {
  userName?: string
  amount?: number
  currency?: string
  planDisplay?: string
  invoiceUrl?: string
  dashboardUrl?: string
}

export default function PaymentConfirmation({
  userName,
  amount,
  currency,
  planDisplay,
  invoiceUrl,
  dashboardUrl,
}: PaymentConfirmationProps) {
  const formattedAmount = amount
    ? `${currency || '$'}${amount}`
    : ''

  return (
    <BaseLayout
      previewText={`Payment confirmed${formattedAmount ? ` for ${formattedAmount}` : ''}`}
      title="Payment Confirmed"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <StatusBadge status="success" label="PAID" />
      <Text style={paragraphStyle}>
        Your payment of <strong>{formattedAmount}</strong>
        {planDisplay ? ` for ${planDisplay}` : ''} has been confirmed.
      </Text>
      {invoiceUrl && (
        <Section style={ctaContainerStyle}>
          <CTAButton href={invoiceUrl}>View Invoice</CTAButton>
        </Section>
      )}
      <Text style={paragraphStyle}>
        Thank you for your continued trust in WPCodingPress.
      </Text>
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
