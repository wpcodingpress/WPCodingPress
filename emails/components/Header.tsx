import { Section, Text } from '@react-email/components'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <Section style={headerStyle}>
      <Text style={brandStyle}>WPCodingPress</Text>
      <Text style={taglineStyle}>AI-Powered Web Development</Text>
      <Text style={titleStyle}>{title}</Text>
    </Section>
  )
}

const headerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  padding: '32px 24px',
  textAlign: 'center',
  borderRadius: '12px 12px 0 0',
}

const brandStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 4px',
  letterSpacing: '1px',
}

const taglineStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(255,255,255,0.8)',
  margin: '0 0 12px',
}

const titleStyle: React.CSSProperties = {
  fontSize: '20px',
  color: '#ffffff',
  margin: '12px 0 0',
  fontWeight: '600',
}
