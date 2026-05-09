import { Section, Text } from '@react-email/components'
import BaseLayout from '../../layouts/BaseLayout'

interface SupportTicketAlertProps {
  userName?: string
  userEmail?: string
  ticketId?: string
  supportMessage?: string
}

export default function SupportTicketAlert({
  userName,
  userEmail,
  ticketId,
  supportMessage,
}: SupportTicketAlertProps) {
  return (
    <BaseLayout
      previewText={`New support ticket${ticketId ? ` #${ticketId}` : ''}`}
      title="New Support Ticket"
    >
      <Text style={paragraphStyle}>Admin Alert,</Text>
      <Text style={paragraphStyle}>
        A new support ticket has been submitted
        {ticketId ? ` (#${ticketId})` : ''}.
      </Text>
      <Section style={detailsBoxStyle}>
        <Text style={detailRowStyle}>
          <strong>From:</strong> {userName || 'N/A'}
        </Text>
        <Text style={detailRowStyle}>
          <strong>Email:</strong> {userEmail || 'N/A'}
        </Text>
        {ticketId && (
          <Text style={detailRowStyle}>
            <strong>Ticket:</strong> #{ticketId}
          </Text>
        )}
      </Section>
      {supportMessage && (
        <Section style={messageBoxStyle}>
          <Text style={messageLabelStyle}>Message:</Text>
          <Text style={messageTextStyle}>{supportMessage}</Text>
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

const messageBoxStyle: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const messageLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#6b7280',
  margin: '0 0 8px',
  textTransform: 'uppercase',
}

const messageTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#374151',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
}
