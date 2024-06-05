import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";


interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en"  dir="ltr">
      <Head>
        <title>Verification Code</title>
       
      </Head>
    <Preview>Here &apos;s your verification code : {otp}</Preview>

    <Section>
        <Row>
            <Heading>Hi {username},</Heading>
        </Row>
        <Row>
            <Text>
                Here &apos;s your verification code : {otp}
            </Text>
        </Row>
        <Row>
            <Text>
                Thanks for using our app.
            </Text> 
        </Row>
        {/* <Row>
            <Button href="https://example.com/verify">Verify</Button>
        </Row> */}

    </Section>

    </Html>
  );
}