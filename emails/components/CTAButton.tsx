import { Button } from '@react-email/components'

interface CTAButtonProps {
  href: string
  children: string
}

export default function CTAButton({ href, children }: CTAButtonProps) {
  return (
    <Button style={buttonStyle} href={href}>
      {children}
    </Button>
  )
}

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '14px 32px',
  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '15px',
  margin: '16px 0',
}
