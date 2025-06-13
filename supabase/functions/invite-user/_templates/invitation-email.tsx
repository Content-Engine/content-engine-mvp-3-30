
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface InvitationEmailProps {
  inviterName: string
  invitedUserName: string
  role: string
  acceptUrl: string
  rejectUrl: string
}

export const InvitationEmail = ({
  inviterName,
  invitedUserName,
  role,
  acceptUrl,
  rejectUrl,
}: InvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>You've been invited to collaborate on Content Engine</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Collaboration Invitation</Heading>
        <Text style={text}>
          Hi {invitedUserName},
        </Text>
        <Text style={text}>
          You've been invited by <strong>{inviterName}</strong> to collaborate on Content Engine with the role of <strong>{role.replace('_', ' ')}</strong>.
        </Text>
        <Text style={text}>
          You can now access shared campaigns and work together on content projects.
        </Text>
        
        <div style={buttonContainer}>
          <Link href={acceptUrl} style={{...button, ...acceptButton}}>
            Accept Invitation
          </Link>
          <Link href={rejectUrl} style={{...button, ...rejectButton}}>
            Decline Invitation
          </Link>
        </div>
        
        <Text style={{...text, color: '#666', fontSize: '12px', marginTop: '32px'}}>
          If you didn't expect this invitation, you can safely ignore this email or click decline.
        </Text>
        
        <Text style={footer}>
          Best regards,<br/>
          The Content Engine Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InvitationEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
}

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
}

const button = {
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 8px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
}

const acceptButton = {
  backgroundColor: '#22c55e',
  color: '#ffffff',
}

const rejectButton = {
  backgroundColor: '#ef4444',
  color: '#ffffff',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '32px',
}
