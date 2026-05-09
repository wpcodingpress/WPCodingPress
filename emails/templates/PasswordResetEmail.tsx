import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import CTAButton from '../components/CTAButton'

interface PasswordResetEmailProps {
  userName?: string
  resetUrl?: string
}

export default function PasswordResetEmail({ userName, resetUrl }: PasswordResetEmailProps) {
  return (
    <BaseLayout
      previewText="Reset your password"
      title="Reset Your Password"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        You requested a password reset for your WPCodingPress account.
        Click the button below to set a new password.
      </Text>
      <Section style={ctaContainerStyle}>
        <CTAButton href={resetUrl || '#'}>
          Reset Password
        </CTAButton>
      </Section>
      <Text style={smallTextStyle}>
        Or copy and paste this link into your browser:
      </Text>
      <Text style={linkTextStyle}>{resetUrl}</Text>
      <Text style={smallTextStyle}>
        This link expires in 1 hour. If you did not request this, please ignore this email.
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

const smallTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: '12px 0',
}

const linkTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#7c3aed',
  wordBreak: 'break-all',
  margin: '4px 0',
}
