const prisma = require('../config/prisma');
const snap = require('../config/midtrans');
const crypto = require('crypto');

const getProducts = async () => {
  return await prisma.product.findMany();
};

const createTransaction = async (userId, productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const transaction = await prisma.transaction.create({
    data: { userId, productId, amount: product.price, status: 'pending' }
  });

  await prisma.payment.create({
    data: { transactionId: transaction.id, gateway: 'midtrans', status: 'pending' }
  });

  const midtransTransaction = await snap.createTransaction({
    transaction_details: { order_id: transaction.id, gross_amount: product.price },
    customer_details: { first_name: user.name, email: user.email },
    item_details: [{ id: product.id, price: product.price, quantity: 1, name: product.name }]
  });

  return {
    transactionId: transaction.id,
    snapToken: midtransTransaction.token,
    snapUrl: midtransTransaction.redirect_url,
    amount: product.price,
    product: product.name
  };
};

const getTransactionHistory = async (userId) => {
  return await prisma.transaction.findMany({
    where: { userId },
    include: { product: true, payment: true },
    orderBy: { createdAt: 'desc' }
  });
};

const handleWebhook = async (payload) => {
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, payment_type } = payload;

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest('hex');

  if (expectedSignature !== signature_key) throw new Error('Invalid signature');

  let transactionStatus, paymentStatus;

  if (transaction_status === 'capture' || transaction_status === 'settlement') {
    if (fraud_status === 'accept' || !fraud_status) {
      transactionStatus = 'paid';
      paymentStatus = 'paid';
    }
  } else if (transaction_status === 'cancel' || transaction_status === 'deny') {
    transactionStatus = 'failed';
    paymentStatus = 'failed';
  } else if (transaction_status === 'expire') {
    transactionStatus = 'expired';
    paymentStatus = 'expired';
  } else {
    transactionStatus = 'pending';
    paymentStatus = 'pending';
  }

  await prisma.transaction.update({
    where: { id: order_id },
    data: { status: transactionStatus, updatedAt: new Date() }
  });

  await prisma.payment.update({
    where: { transactionId: order_id },
    data: {
      status: paymentStatus,
      paymentMethod: payment_type,
      gatewayReference: payload.transaction_id,
      paidAt: transactionStatus === 'paid' ? new Date() : null
    }
  });

  return { message: 'Webhook processed successfully' };
};

module.exports = { getProducts, createTransaction, getTransactionHistory, handleWebhook };