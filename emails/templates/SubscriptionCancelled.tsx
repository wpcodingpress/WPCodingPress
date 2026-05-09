import { Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import AlertBox from '../components/AlertBox'

interface SubscriptionCancelledProps {
  userName?: string
  planDisplay?: string
  reason?: string
}

export default function SubscriptionCancelled({
  userName,
  planDisplay,
  reason,
}: SubscriptionCancelledProps) {
  return (
    <BaseLayout
      previewText="Subscription cancelled"
      title="Subscription Cancelled"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <AlertBox
        type="warning"
        message={`Your ${planDisplay || 'subscription'} plan has been cancelled.`}
      />
      <Text style={paragraphStyle}>
        You will continue to have access until the end of your current billing period.
      </Text>
      {reason && (
        <Text style={paragraphStyle}>
          Reason: <strong>{reason}</strong>
        </Text>
      )}
      <Text style={paragraphStyle}>
        We are sorry to see you go. If you change your mind, you can resubscribe anytime from your account dashboard.
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
