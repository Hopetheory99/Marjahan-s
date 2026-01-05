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

interface OrderConfirmationProps {
  customerName?: string;
  orderId: string;
  orderDate: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  customerName = 'Valued Customer',
  orderId,
  orderDate,
  total,
  items,
  shippingAddress,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100

  return (
    <Html>
      <Head>
        <title>Order Confirmation - {orderId}</title>
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
            <Heading style={h1}>Thank You for Your Order!</Heading>
            <Text style={text}>Your luxury jewelry is on its way</Text>
          </Section>

          <Hr style={hr} />

          {/* Order Details */}
          <Section style={orderDetails}>
            <Heading style={h2}>Order Details</Heading>
            <Row>
              <Column>
                <Text style={label}>Order Number:</Text>
                <Text style={value}>#{orderId}</Text>
              </Column>
              <Column>
                <Text style={label}>Order Date:</Text>
                <Text style={value}>{orderDate}</Text>
              </Column>
            </Row>
          </Section>

          {/* Items */}
          <Section style={itemsSection}>
            <Heading style={h3}>Items Ordered</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemImageCol}>
                  {item.image && (
                    <Img
                      src={item.image}
                      width="80"
                      height="80"
                      alt={item.name}
                      style={itemImage}
                    />
                  )}
                </Column>
                <Column style={itemDetailsCol}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>Quantity: {item.quantity}</Text>
                  <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Order Summary */}
          <Section style={summarySection}>
            <Heading style={h3}>Order Summary</Heading>
            <Row>
              <Column>
                <Text style={summaryLabel}>Subtotal:</Text>
              </Column>
              <Column>
                <Text style={summaryValue}>${subtotal.toFixed(2)}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={summaryLabel}>Tax:</Text>
              </Column>
              <Column>
                <Text style={summaryValue}>${tax.toFixed(2)}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={summaryLabel}>Shipping:</Text>
              </Column>
              <Column>
                <Text style={summaryValue}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </Column>
            </Row>
            <Hr style={summaryHr} />
            <Row>
              <Column>
                <Text style={totalLabel}>Total:</Text>
              </Column>
              <Column>
                <Text style={totalValue}>${total.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping Address */}
          {shippingAddress && (
            <Section style={addressSection}>
              <Heading style={h3}>Shipping Address</Heading>
              <Text style={addressText}>
                {customerName}
                <br />
                {shippingAddress.street}
                <br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                <br />
                {shippingAddress.country}
              </Text>
            </Section>
          )}

          {/* Next Steps */}
          <Section style={nextSteps}>
            <Heading style={h3}>What's Next?</Heading>
            <Text style={text}>
              <strong>Order Processing:</strong> We'll begin preparing your jewelry within 1-2
              business days.
              <br />
              <strong>Shipping:</strong> You'll receive a tracking number via email once your order
              ships.
              <br />
              <strong>Delivery:</strong> Standard delivery takes 3-5 business days.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              href={`${process.env.VITE_APP_URL || 'https://marjahans.com'}/orders/${orderId}`}
              style={button}
            >
              Track Your Order
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
              The Marjahan's Jewelry Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmation;

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

const orderDetails = {
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
};

const itemsSection = {
  backgroundColor: '#ffffff',
  padding: '30px',
  margin: '20px 0',
};

const itemRow = {
  margin: '20px 0',
  padding: '20px 0',
  borderBottom: '1px solid #e6e6e6',
};

const itemImageCol = {
  width: '100px',
};

const itemImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
};

const itemDetailsCol = {
  paddingLeft: '20px',
};

const itemName = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 5px',
};

const itemMeta = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 5px',
};

const itemPrice = {
  color: '#8B5A3C',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
};

const summarySection = {
  backgroundColor: '#ffffff',
  padding: '30px',
  margin: '20px 0',
};

const summaryLabel = {
  color: '#666666',
  fontSize: '14px',
  textAlign: 'right' as const,
  padding: '5px 0',
};

const summaryValue = {
  color: '#333333',
  fontSize: '14px',
  textAlign: 'right' as const,
  padding: '5px 0',
};

const summaryHr = {
  borderColor: '#cccccc',
  margin: '10px 0',
};

const totalLabel = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  padding: '10px 0',
};

const totalValue = {
  color: '#8B5A3C',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  padding: '10px 0',
};

const addressSection = {
  backgroundColor: '#ffffff',
  padding: '30px',
  margin: '20px 0',
};

const addressText = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '20px',
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
