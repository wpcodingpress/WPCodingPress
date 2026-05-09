import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import CTAButton from '../components/CTAButton'

interface EmailVerificationProps {
  userName?: string
  verificationUrl?: string
}

export default function EmailVerification({ userName, verificationUrl }: EmailVerificationProps) {
  return (
    <BaseLayout
      previewText="Verify your email address"
      title="Verify Your Email"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        Please verify your email address to activate your WPCodingPress account.
        Click the button below to confirm your email.
      </Text>
      <Section style={ctaContainerStyle}>
        <CTAButton href={verificationUrl || '#'}>
          Verify Email Address
        </CTAButton>
      </Section>
      <Text style={smallTextStyle}>
        If you did not create an account, you can safely ignore this email.
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
  margin: '16px 0',
  textAlign: 'center',
}
