import { Section, Text } from '@react-email/components'
import BaseLayout from '../layouts/BaseLayout'
import CTAButton from '../components/CTAButton'

interface OnboardingWelcomeProps {
  userName?: string
  company?: string
  planDisplay?: string
  onboardingUrl?: string
}

export default function OnboardingWelcome({
  userName,
  company,
  planDisplay,
  onboardingUrl,
}: OnboardingWelcomeProps) {
  return (
    <BaseLayout
      previewText="Let's get started with your project"
      title="Welcome Aboard!"
    >
      <Text style={paragraphStyle}>Hi {userName || 'there'},</Text>
      <Text style={paragraphStyle}>
        Welcome to {planDisplay || 'your'} plan{company ? ` at ${company}` : ''}!
        We are excited to start building your website.
      </Text>
      <Text style={headingStyle}>Next Steps:</Text>
      <ol style={listStyle}>
        <li style={listItemStyle}>
          Complete the onboarding form with your project details
        </li>
        <li style={listItemStyle}>
          Your project manager will review your requirements
        </li>
        <li style={listItemStyle}>
          We will begin the design and development process
        </li>
        <li style={listItemStyle}>
          Your site will go live within the agreed timeline
        </li>
      </ol>
      <Section style={ctaContainerStyle}>
        <CTAButton href={onboardingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`}>
          Start Onboarding
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

const headingStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '20px 0 8px',
}

const listStyle: React.CSSProperties = {
  paddingLeft: '24px',
  margin: '8px 0',
}

const listItemStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.8',
  color: '#4b5563',
  margin: '4px 0',
}

const ctaContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '24px 0',
}
