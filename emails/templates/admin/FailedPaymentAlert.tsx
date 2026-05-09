import { Section, Text } from '@react-email/components'
import BaseLayout from '../../layouts/BaseLayout'
import AlertBox from '../../components/AlertBox'

interface FailedPaymentAlertProps {
  userName?: string
  userEmail?: string
  amount?: number
  currency?: string
  planDisplay?: string
}

export default function FailedPaymentAlert({
  userName,
  userEmail,
  amount,
  currency,
  planDisplay,
}: FailedPaymentAlertProps) {
  return (
    <BaseLayout
      previewText={`Payment failed for ${userEmail || 'user'}`}
      title="Payment Failed - Action Required"
    >
      <Text style={paragraphStyle}>Admin Alert,</Text>
      <AlertBox
        type="error"
        message="A payment has failed. Immediate attention may be required."
      />
      <Section style={detailsBoxStyle}>
        <Text style={detailRowStyle}>
          <strong>Customer:</strong> {userName || 'N/A'}
        </Text>
        <Text style={detailRowStyle}>
          <strong>Email:</strong> {userEmail || 'N/A'}
        </Text>
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
  backgroundColor: '#fef2f2',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #fecaca',
  margin: '16px 0',
}

const detailRowStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '4px 0',
}
