/**
 * Premium Email Invoice Template
 * Returns HTML string for an order confirmation email
 */
export const getInvoiceHTML = (charge) => {
    const { id, amount, currency, metadata, payment_method, created_at } = charge;
    const formattedAmount = (amount / 100).toLocaleString('en-TH', { style: 'currency', currency: currency.toUpperCase() });
    const date = new Date(created_at).toLocaleDateString();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.05); }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f8f8f8; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; color: #667eea; text-transform: uppercase; letter-spacing: 2px; }
            .invoice-label { color: #999; text-transform: uppercase; font-size: 12px; font-weight: bold; }
            .client-info { margin-bottom: 30px; }
            .section-title { font-size: 14px; font-weight: bold; color: #667eea; text-transform: uppercase; margin-bottom: 10px; display: block; }
            .item-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .item-table th { text-align: left; padding: 12px; background: #fdfdfd; color: #999; font-size: 12px; text-transform: uppercase; }
            .item-table td { padding: 16px 12px; border-bottom: 1px solid #f8f8f8; }
            .total-row { background: #f8f8f8; font-weight: bold; font-size: 18px; border-bottom: 2px solid #eee; }
            .shipping-box { background: #f9fafb; padding: 24px; border-radius: 16px; margin-top: 30px; }
            .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
            .thank-you { font-size: 20px; font-weight: bold; margin-bottom: 5px; color: #333; }
            .order-tag { display: inline-block; padding: 4px 12px; background: #e0e7ff; color: #4338ca; border-radius: 6px; font-size: 11px; margin-top: 8px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo font-black">MK-ULTRA</div>
              <div style="text-align: right;">
                <div class="invoice-label">Invoice ID</div>
                <div style="font-weight: bold;">#${id.slice(-8).toUpperCase()}</div>
              </div>
            </div>

            <div class="thank-you">Order Confirmation</div>
            <p>Thank you for your purchase! We've received your payment and our team is preparing your MK-Ultra keyboard for shipment.</p>
            <div class="order-tag">Charge ID: ${id}</div>

            <div style="margin-top: 40px;">
              <span class="section-title">Order Summary</span>
              <table class="item-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style="font-weight: bold;">MK-Ultra 65% Limited Edition</div>
                      <div style="color: #666; font-size: 12px;">Premium Mechanical Keyboard • CNC Aluminum</div>
                    </td>
                    <td style="text-align: right; font-weight: bold;">${formattedAmount}</td>
                  </tr>
                  <tr class="total-row">
                    <td>Total Paid</td>
                    <td style="text-align: right; color: #667eea;">${formattedAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="shipping-box">
              <span class="section-title">Shipping To</span>
              <div style="font-weight: bold; font-size: 16px;">${metadata.shipping_name || 'Customer'}</div>
              <div style="color: #666; font-size: 14px; margin-top: 5px;">
                ${metadata.shipping_address || 'No address provided.'}
              </div>
              <div style="margin-top: 10px; font-size: 14px;">
                <span style="color: #999;">Phone:</span> ${metadata.shipping_phone || '-'}
              </div>
            </div>

            <div style="margin-top: 30px; font-size: 14px;">
              <span class="section-title">Payment Info</span>
              <div style="display: flex; gap: 20px;">
                <div><span style="color: #999;">Method:</span> ${payment_method || 'PromptPay'}</div>
                <div><span style="color: #999;">Date:</span> ${date}</div>
              </div>
            </div>

            <div class="footer">
              If you have any questions, please reply to this email.<br/>
              © 2026 MK-ULTRA Keyboards. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
};
