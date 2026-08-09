export const orderConfirmationTemplate = (orderId: string, customerName: string, totalAmount: number) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Order Confirmation</h2>
      <p>Hi ${customerName},</p>
      <p>Thank you for your order! Your order ID is <strong>${orderId}</strong>.</p>
      <p>Total Amount: <strong>$${totalAmount.toFixed(2)}</strong></p>
      <p>We will notify you once your order has been shipped.</p>
      <br />
      <p>Best regards,</p>
      <p>Your Store Team</p>
    </div>
  `;
};

export const orderStatusUpdateTemplate = (orderId: string, customerName: string, status: string) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Order Status Update</h2>
      <p>Hi ${customerName},</p>
      <p>The status of your order <strong>${orderId}</strong> has been updated to: <strong>${status}</strong>.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <br />
      <p>Best regards,</p>
      <p>Your Store Team</p>
    </div>
  `;
};
