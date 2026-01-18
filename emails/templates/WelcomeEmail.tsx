import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Row,
  Column,
  Img,
  Link,
  Button,
} from '@react-email/components';

interface WelcomeEmailProps {
  customerName?: string;
  customerEmail: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  customerName = 'Valued Customer',
  customerEmail,
}) => {
  return (
    <Html>
      <Head>
        <title>Welcome to Marjahan&apos;s Jewelry</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://picsum.photos/id/1074/1200/630"
              width="80"
              height="80"
              alt="Marjahan's Jewelry"
              style={logo}
            />
            <Heading style={h1}>Welcome to Marjahan&apos;s Jewelry! ✨</Heading>
            <Text style={subtitle}>Where Luxury Meets Affordability</Text>
          </Section>

          <Hr style={hr} />

          {/* Welcome Message */}
          <Section style={welcomeSection}>
            <Heading style={h2}>Dear {customerName},</Heading>
            <Text style={welcomeText}>
              Thank you for joining the Marjahan&apos;s Jewelry family! We&apos;re absolutely
              delighted to have you as part of our community of discerning jewelry lovers.
            </Text>
            <Text style={welcomeText}>
              For over two decades, we&apos;ve been crafting exquisite jewelry that combines
              timeless elegance with exceptional value. Each piece in our collection tells a story
              of craftsmanship, beauty, and sophistication.
            </Text>
          </Section>

          {/* Featured Collections */}
          <Section style={collectionsSection}>
            <Heading style={h3}>Discover Our Collections</Heading>

            <Row style={collectionRow}>
              <Column style={collectionCol}>
                <div style={collectionCard}>
                  <Img
                    src="https://picsum.photos/id/1075/300/200"
                    width="100%"
                    height="120"
                    alt="Rings Collection"
                    style={collectionImage}
                  />
                  <Text style={collectionTitle}>Luxury Rings</Text>
                  <Text style={collectionDesc}>From delicate bands to statement pieces</Text>
                </div>
              </Column>
              <Column style={collectionCol}>
                <div style={collectionCard}>
                  <Img
                    src="https://picsum.photos/id/1076/300/200"
                    width="100%"
                    height="120"
                    alt="Necklaces Collection"
                    style={collectionImage}
                  />
                  <Text style={collectionTitle}>Elegant Necklaces</Text>
                  <Text style={collectionDesc}>Timeless designs for every occasion</Text>
                </div>
              </Column>
            </Row>

            <Row style={collectionRow}>
              <Column style={collectionCol}>
                <div style={collectionCard}>
                  <Img
                    src="https://picsum.photos/id/1077/300/200"
                    width="100%"
                    height="120"
                    alt="Bracelets Collection"
                    style={collectionImage}
                  />
                  <Text style={collectionTitle}>Designer Bracelets</Text>
                  <Text style={collectionDesc}>Stackable styles and bold statements</Text>
                </div>
              </Column>
              <Column style={collectionCol}>
                <div style={collectionCard}>
                  <Img
                    src="https://picsum.photos/id/1078/300/200"
                    width="100%"
                    height="120"
                    alt="Earrings Collection"
                    style={collectionImage}
                  />
                  <Text style={collectionTitle}>Statement Earrings</Text>
                  <Text style={collectionDesc}>From studs to chandelier designs</Text>
                </div>
              </Column>
            </Row>
          </Section>

          {/* Special Offer */}
          <Section style={offerSection}>
            <div style={offerCard}>
              <Heading style={offerTitle}>🎁 Welcome Gift</Heading>
              <Text style={offerText}>
                As a token of our appreciation, enjoy <strong>10% off</strong> your first purchase
                with code:
              </Text>
              <div style={couponCode}>WELCOME10</div>
              <Text style={offerNote}>
                Valid for 30 days • Cannot be combined with other offers
              </Text>
            </div>
          </Section>

          {/* Why Choose Us */}
          <Section style={whyChooseSection}>
            <Heading style={h3}>Why Choose Marjahan&apos;s?</Heading>

            <Row style={featureRow}>
              <Column style={featureCol}>
                <div style={featureItem}>
                  <Text style={featureIcon}>💎</Text>
                  <Text style={featureTitle}>Premium Quality</Text>
                  <Text style={featureDesc}>
                    Carefully selected materials and expert craftsmanship
                  </Text>
                </div>
              </Column>
              <Column style={featureCol}>
                <div style={featureItem}>
                  <Text style={featureIcon}>🚚</Text>
                  <Text style={featureTitle}>Free Shipping</Text>
                  <Text style={featureDesc}>Complimentary shipping on orders over $100</Text>
                </div>
              </Column>
            </Row>

            <Row style={featureRow}>
              <Column style={featureCol}>
                <div style={featureItem}>
                  <Text style={featureIcon}>🔒</Text>
                  <Text style={featureTitle}>Secure Shopping</Text>
                  <Text style={featureDesc}>SSL encryption and secure payment processing</Text>
                </div>
              </Column>
              <Column style={featureCol}>
                <div style={featureItem}>
                  <Text style={featureIcon}>↩️</Text>
                  <Text style={featureTitle}>Easy Returns</Text>
                  <Text style={featureDesc}>30-day return policy for your peace of mind</Text>
                </div>
              </Column>
            </Row>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/products`}
              style={primaryButton}
            >
              Shop Our Collection
            </Button>
            <Button
              href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/wishlist`}
              style={secondaryButton}
            >
              Create Wishlist
            </Button>
          </Section>

          {/* Social Proof */}
          <Section style={socialSection}>
            <Heading style={h4}>Join Thousands of Satisfied Customers</Heading>
            <Text style={socialText}>
              ⭐⭐⭐⭐⭐ &quot;Absolutely stunning pieces! The quality exceeded my
              expectations.&quot; - Sarah M.
              <br />
              ⭐⭐⭐⭐⭐ &quot;Fast shipping and beautiful packaging. Will definitely order
              again!&quot; - Michael R.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? We&apos;re here to help! Contact our customer service at{' '}
              <Link href="mailto:support@marjahans.com" style={link}>
                support@marjahans.com
              </Link>
            </Text>

            <Row style={footerLinks}>
              <Column>
                <Link
                  href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/about`}
                  style={footerLink}
                >
                  About Us
                </Link>
              </Column>
              <Column>
                <Link
                  href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/shipping`}
                  style={footerLink}
                >
                  Shipping Info
                </Link>
              </Column>
              <Column>
                <Link
                  href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/returns`}
                  style={footerLink}
                >
                  Returns
                </Link>
              </Column>
              <Column>
                <Link
                  href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/contact`}
                  style={footerLink}
                >
                  Contact
                </Link>
              </Column>
            </Row>

            <Text style={footerSignature}>
              With love and sparkle,
              <br />
              The Marjahan&apos;s Jewelry Team 💎
            </Text>

            <Text style={unsubscribe}>
              You&apos;re receiving this email because you signed up at marjahans.com.
              <Link
                href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/unsubscribe?email=${encodeURIComponent(customerEmail)}`}
                style={unsubscribeLink}
              >
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f8f9fa',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#ffffff',
  padding: '40px 30px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
};

const logo = {
  margin: '0 auto 20px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const h1 = {
  color: '#8B5A3C',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'center' as const,
};

const subtitle = {
  color: '#666666',
  fontSize: '18px',
  fontWeight: '300',
  margin: '0',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
};

const welcomeSection = {
  backgroundColor: '#ffffff',
  padding: '40px 30px',
  margin: '20px 0',
};

const h2 = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
};

const h3 = {
  color: '#333333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const h4 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px',
  textAlign: 'center' as const,
};

const welcomeText = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const collectionsSection = {
  backgroundColor: '#ffffff',
  padding: '40px 30px',
  margin: '20px 0',
};

const collectionRow = {
  margin: '20px 0',
};

const collectionCol = {
  padding: '0 10px',
};

const collectionCard = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '15px',
  textAlign: 'center' as const,
  border: '1px solid #e6e6e6',
};

const collectionImage = {
  borderRadius: '6px',
  marginBottom: '10px',
  objectFit: 'cover' as const,
};

const collectionTitle = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 5px',
};

const collectionDesc = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
};

const offerSection = {
  backgroundColor: '#8B5A3C',
  padding: '40px 30px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const offerCard = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '30px',
  display: 'inline-block',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
};

const offerTitle = {
  color: '#8B5A3C',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 15px',
};

const offerText = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const couponCode = {
  backgroundColor: '#8B5A3C',
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  padding: '15px 30px',
  borderRadius: '8px',
  display: 'inline-block',
  margin: '10px 0',
  letterSpacing: '2px',
};

const offerNote = {
  color: '#666666',
  fontSize: '14px',
  margin: '15px 0 0',
  fontStyle: 'italic',
};

const whyChooseSection = {
  backgroundColor: '#ffffff',
  padding: '40px 30px',
  margin: '20px 0',
};

const featureRow = {
  margin: '20px 0',
};

const featureCol = {
  padding: '0 15px',
};

const featureItem = {
  textAlign: 'center' as const,
  padding: '20px',
};

const featureIcon = {
  fontSize: '32px',
  marginBottom: '10px',
};

const featureTitle = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const featureDesc = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const primaryButton = {
  backgroundColor: '#8B5A3C',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '15px 40px',
  margin: '0 10px 10px',
  boxShadow: '0 4px 12px rgba(139, 90, 60, 0.3)',
};

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '2px solid #8B5A3C',
  borderRadius: '8px',
  color: '#8B5A3C',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '13px 38px',
  margin: '0 10px 10px',
};

const socialSection = {
  backgroundColor: '#f8f9fa',
  padding: '30px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const socialText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '15px 0 0',
  fontStyle: 'italic',
};

const footer = {
  backgroundColor: '#333333',
  padding: '40px 30px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#cccccc',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 20px',
};

const footerLinks = {
  margin: '20px 0',
};

const footerLink = {
  color: '#8B5A3C',
  fontSize: '14px',
  textDecoration: 'none',
  margin: '0 10px',
};

const footerSignature = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
};

const unsubscribe = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '20px 0 0',
};

const unsubscribeLink = {
  color: '#8B5A3C',
  textDecoration: 'underline',
};

const link = {
  color: '#8B5A3C',
  textDecoration: 'underline',
};
