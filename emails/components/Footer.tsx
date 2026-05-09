import { Section, Text, Link, Hr } from '@react-email/components'

export default function Footer() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wpcodingpress.com'
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@wpcodingpress.com'

  return (
    <Section style={footerStyle}>
      <Hr style={hrStyle} />
      <Text style={footerTextStyle}>
        &copy; {new Date().getFullYear()} WPCodingPress. All rights reserved.
      </Text>
      <Text style={footerTextStyle}>
        Need help? Contact us at{' '}
        <Link href={`mailto:${supportEmail}`} style={linkStyle}>
          {supportEmail}
        </Link>
      </Text>
      <Text style={footerTextStyle}>
        <Link href={`${appUrl}/privacy`} style={linkStyle}>
          Privacy Policy
        </Link>
        {' | '}
        <Link href={`${appUrl}/terms`} style={linkStyle}>
          Terms of Service
        </Link>
      </Text>
    </Section>
  )
}

const footerStyle: React.CSSProperties = {
  padding: '24px',
  textAlign: 'center',
}

const hrStyle: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '0 0 16px',
}

const footerTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '4px 0',
  lineHeight: '1.5',
}

const linkStyle: React.CSSProperties = {
  color: '#7c3aed',
  textDecoration: 'underline',
}
