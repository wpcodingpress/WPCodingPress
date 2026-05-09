import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import AlertBox from '../components/AlertBox'

interface SupportReplyProps {
  userName?: string
  replyContent?: string
  ticketId?: string
  supportMessage?: string
}

export default function SupportReply({
  userName,
  replyContent,
  ticketId,
  supportMessage,
}: SupportReplyProps) {
  return (
    <BaseLayout
      previewText={`Support reply${ticketId ? ` for ticket #${ticketId}` : ''}`}
      title="Support Reply"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        Our support team has replied to your ticket
        {ticketId ? ` (#${ticketId})` : ''}.
      </Text>
      {supportMessage && (
        <AlertBox type="info" message={`Your message: "${supportMessage}"`} />
      )}
      {replyContent && (
        <Section style={replyBoxStyle}>
          <Text style={replyLabelStyle}>Our response:</Text>
          <Text style={replyTextStyle}>{replyContent}</Text>
        </Section>
      )}
      <Text style={smallTextStyle}>
        Reply to this email to continue the conversation with our support team.
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

const replyBoxStyle: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
}

const replyLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#6b7280',
  margin: '0 0 8px',
  textTransform: 'uppercase',
}

const replyTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#374151',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
}

const smallTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: '16px 0',
}
