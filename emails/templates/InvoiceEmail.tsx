import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import CTAButton from '../components/CTAButton'

interface InvoiceEmailProps {
  userName?: string
  invoiceId?: string
  amount?: number
  currency?: string
  planDisplay?: string
  invoiceUrl?: string
}

export default function InvoiceEmail({
  userName,
  invoiceId,
  amount,
  currency,
  planDisplay,
  invoiceUrl,
}: InvoiceEmailProps) {
  return (
    <BaseLayout
      previewText={`Invoice #${invoiceId || 'N/A'} available`}
      title="Invoice Available"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        Your invoice{invoiceId ? ` #${invoiceId}` : ''} is now available.
      </Text>
      <Section style={detailsBoxStyle}>
        {invoiceId && (
          <Text style={detailRowStyle}>
            <strong>Invoice:</strong> #{invoiceId}
          </Text>
        )}
        {amount && (
          <Text style={detailRowStyle}>
            <strong>Amount:</strong> {currency || '$'}{amount}
          </Text>
        )}
        {planDisplay && (
          <Text style={detailRowStyle}>
            <strong>Plan:</strong> {planDisplay}
          </Text>
        )}
      </Section>
      {invoiceUrl && (
        <Section style={ctaContainerStyle}>
          <CTAButton href={invoiceUrl}>View Invoice</CTAButton>
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

const ctaContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0',
}
