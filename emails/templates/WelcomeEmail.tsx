import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import CTAButton from '../components/CTAButton'

interface WelcomeEmailProps {
  userName?: string
  dashboardUrl?: string
}

export default function WelcomeEmail({ userName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <BaseLayout
      previewText={`Welcome to WPCodingPress, ${userName || 'there'}!`}
      title="Welcome to WPCodingPress!"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        Thank you for joining WPCodingPress! We are excited to have you on board.
      </Text>
      <Text style={paragraphStyle}>You can now:</Text>
      <ul style={listStyle}>
        <li style={listItemStyle}>Browse our premium WordPress plugins</li>
        <li style={listItemStyle}>Access MCP servers</li>
        <li style={listItemStyle}>View and manage your orders</li>
        <li style={listItemStyle}>Download purchased products</li>
      </ul>
      <Section style={ctaContainerStyle}>
        <CTAButton href={dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
          Go to Dashboard
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

const listStyle: React.CSSProperties = {
  paddingLeft: '24px',
  margin: '12px 0',
}

const listItemStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '4px 0',
}

const ctaContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0',
}
