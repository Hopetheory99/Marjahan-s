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

interface OrderStatusUpdateProps {
  orderId: string;
  newStatus: string;
  statusMessage: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  orderId,
  newStatus,
  statusMessage,
  estimatedDelivery,
  trackingNumber,
  trackingUrl,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return '#f59e0b'; // amber
      case 'shipped':
        return '#3b82f6'; // blue
      case 'delivered':
        return '#10b981'; // green
      case 'cancelled':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  return (
    <Html>
      <Head>
        <title>Order Update - {orderId}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://picsum.photos/id/1074/1200/630"
              width="60"
              height="60"
              alt="Marjahan's Jewelry"
              style={logo}
            />
            <Heading style={h1}>Order Status Update</Heading>
            <Text style={text}>Your order #{orderId} has been updated</Text>
          </Section>

          <Hr style={hr} />

          {/* Status Update */}
          <Section style={statusSection}>
            <div style={statusCard}>
              <div style={statusIcon}>{getStatusIcon(newStatus)}</div>
              <Heading style={{ ...h2, color: getStatusColor(newStatus) as any }}>
                Order {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
              </Heading>
              <Text style={statusMessageStyle}>{statusMessage}</Text>
            </div>
          </Section>

          {/* Tracking Information */}
          {trackingNumber && (
            <Section style={trackingSection}>
              <Heading style={h3}>Tracking Information</Heading>
              <Row>
                <Column>
                  <Text style={label}>Tracking Number:</Text>
                  <Text style={value}>{trackingNumber}</Text>
                </Column>
                {trackingUrl && (
                  <Column>
                    <Text style={label}>Track Package:</Text>
                    <Button
                      href={trackingUrl}
                      style={{ ...button, backgroundColor: getStatusColor(newStatus) }}
                    >
                      Track Shipment
                    </Button>
                  </Column>
                )}
              </Row>
            </Section>
          )}

          {/* Estimated Delivery */}
          {estimatedDelivery && (
            <Section style={deliverySection}>
              <Heading style={h3}>Estimated Delivery</Heading>
              <Text style={deliveryText}>📅 Expected delivery by {estimatedDelivery}</Text>
              <Text style={deliveryNote}>
                *Delivery dates are estimates and may vary based on carrier performance and other
                factors.
              </Text>
            </Section>
          )}

          {/* Next Steps */}
          <Section style={nextSteps}>
            <Heading style={h3}>What&apos;s Next?</Heading>
            <Text style={text}>
              {newStatus.toLowerCase() === 'processing' && (
                <>
                  <strong>Quality Check:</strong> Our artisans are carefully inspecting your
                  jewelry.
                  <br />
                  <strong>Packaging:</strong> Your items will be securely packaged in our luxury
                  presentation boxes.
                  <br />
                  <strong>Shipping:</strong> You&apos;ll receive another email with tracking
                  information.
                </>
              )}
              {newStatus.toLowerCase() === 'shipped' && (
                <>
                  <strong>Track Your Package:</strong> Use the tracking number above to monitor
                  delivery.
                  <br />
                  <strong>Delivery Notification:</strong> You&apos;ll receive a final email when
                  your package arrives.
                  <br />
                  <strong>Contact Us:</strong> Questions? We&apos;re here to help.
                </>
              )}
              {newStatus.toLowerCase() === 'delivered' && (
                <>
                  <strong>Enjoy Your Jewelry:</strong> We hope you love your new pieces!
                  <br />
                  <strong>Share Your Experience:</strong> Leave a review to help other customers.
                  <br />
                  <strong>Customer Care:</strong> Contact us for any questions or concerns.
                </>
              )}
              {newStatus.toLowerCase() === 'cancelled' && (
                <>
                  <strong>Refund Processing:</strong> Your refund will be processed within 3-5
                  business days.
                  <br />
                  <strong>Account Credit:</strong> Refunds are applied to your original payment
                  method.
                  <br />
                  <strong>Contact Support:</strong> Questions about your refund? We&apos;re here to
                  help.
                </>
              )}
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/orders/${orderId}`}
              style={button}
            >
              View Order Details
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions about your order? Contact our customer service at{' '}
              <Link href="mailto:support@marjahans.com" style={link}>
                support@marjahans.com
              </Link>
            </Text>
            <Text style={footerText}>
              Visit us at{' '}
              <Link href="https://marjahans.com" style={link}>
                marjahans.com
              </Link>
            </Text>
            <Text style={footerSignature}>
              Best regards,
              <br />
              The Marjahan&apos;s Jewelry Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderStatusUpdate;

// Styles
const main = {
  backgroundColor: '#f6f6f6',
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
};

const logo = {
  margin: '0 auto 20px',
  borderRadius: '8px',
};

const h1 = {
  color: '#8B5A3C',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px',
};

const text = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
};

const statusSection = {
  backgroundColor: '#ffffff',
  padding: '40px 30px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const statusCard = {
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  padding: '30px',
  border: '2px solid #e6e6e6',
};

const statusIcon = {
  fontSize: '48px',
  marginBottom: '20px',
};

const statusMessageStyle = {
  color: '#333333',
  fontSize: '18px',
  lineHeight: '26px',
  margin: '0',
};

const trackingSection = {
  backgroundColor: '#ffffff',
  padding: '30px',
  margin: '20px 0',
};

const label = {
  color: '#666666',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 5px',
};

const value = {
  color: '#333333',
  fontSize: '16px',
  margin: '0 0 15px',
  fontFamily: 'monospace',
  backgroundColor: '#f8f9fa',
  padding: '8px 12px',
  borderRadius: '4px',
  display: 'inline-block',
};

const deliverySection = {
  backgroundColor: '#ffffff',
  padding: '30px',
  margin: '20px 0',
};

const deliveryText = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const deliveryNote = {
  color: '#666666',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '0',
};

const nextSteps = {
  backgroundColor: '#ffffff',
  padding: '30px',
  margin: '20px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#8B5A3C',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 30px',
};

const footer = {
  backgroundColor: '#f6f6f6',
  padding: '30px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 10px',
};

const footerSignature = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '20px 0 0',
};

const link = {
  color: '#8B5A3C',
  textDecoration: 'underline',
};
