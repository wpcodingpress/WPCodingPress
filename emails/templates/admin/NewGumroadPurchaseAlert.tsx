import { Section, Text } from '@react-email/components'
import BaseLayout from '../../layouts/BaseLayout'

interface NewGumroadPurchaseAlertProps {
  userName?: string
  userEmail?: string
  productName?: string
  planDisplay?: string
  amount?: number
  currency?: string
  billingCycle?: string
}

export default function NewGumroadPurchaseAlert({
  userName,
  userEmail,
  productName,
  planDisplay,
  amount,
  currency,
  billingCycle,
}: NewGumroadPurchaseAlertProps) {
  return (
    <BaseLayout
      previewText={`New Gumroad purchase: ${planDisplay || productName || 'unknown'}`}
      title="New Gumroad Purchase"
    >
      <Text style={paragraphStyle}>Admin Alert,</Text>
      <Text style={paragraphStyle}>
        A new purchase has been made via Gumroad.
      </Text>
      <Section style={detailsBoxStyle}>
        <Text style={detailRowStyle}>
          <strong>Customer:</strong> {userName || 'N/A'}
        </Text>
        <Text style={detailRowStyle}>
          <strong>Email:</strong> {userEmail || 'N/A'}
        </Text>
        <Text style={detailRowStyle}>
          <strong>Product:</strong> {productName || planDisplay || 'N/A'}
        </Text>
        {planDisplay && (
          <Text style={detailRowStyle}>
            <strong>Plan:</strong> {planDisplay}
          </Text>
        )}
        {amount && (
          <Text style={detailRowStyle}>
            <strong>Amount:</strong> {currency || '$'}{amount}
          </Text>
        )}
        {billingCycle && (
          <Text style={detailRowStyle}>
            <strong>Billing:</strong> {billingCycle}
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
