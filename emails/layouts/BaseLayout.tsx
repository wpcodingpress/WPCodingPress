import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
} from '@react-email/components'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface BaseLayoutProps {
  previewText: string
  title: string
  children: React.ReactNode
}

export default function BaseLayout({ previewText, title, children }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Header title={title} />
          <Section style={contentStyle}>{children}</Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: '0',
  padding: '0',
}

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '24px 12px',
}

const contentStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
  borderRadius: '0 0 12px 12px',
}
