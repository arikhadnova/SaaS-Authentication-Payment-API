const prisma = require('../config/prisma');
const snap = require('../config/midtrans');

const getProducts = async () => {
  return await prisma.product.findMany();
};

const createTransaction = async (userId, productId) => {

  // Cari product
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Cari user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  // Buat transaksi di database kita dulu
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      productId,
      amount: product.price,
      status: 'pending'
    }
  });

  // Buat payment record
  await prisma.payment.create({
    data: {
      transactionId: transaction.id,
      gateway: 'midtrans',
      status: 'pending'
    }
  });

  // Kirim request ke Midtrans
  const midtransTransaction = await snap.createTransaction({
    transaction_details: {
      order_id: transaction.id,
      gross_amount: product.price
    },
    customer_details: {
    first_name: user.name,
    email: user.email
  },
  item_details: [{
    id: product.id,
    price: product.price,
    quantity: 1,
    name: product.name
  }],
  callbacks: {
    finish: 'https://saas-authentication-payment-api.vercel.app/dashboard',
    error: 'https://saas-authentication-payment-api.vercel.app/dashboard',
    pending: 'https://saas-authentication-payment-api.vercel.app/dashboard'
  }
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
    include: {
      product: true,
      payment: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

const crypto = require('crypto');

const handleWebhook = async (payload) => {

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
    payment_type
  } = payload;

  // Verifikasi signature
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest('hex');

  if (expectedSignature !== signature_key) {
    throw new Error('Invalid signature');
  }

  // Tentukan status berdasarkan response Midtrans
  let transactionStatus;
  let paymentStatus;

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

  // Update transaksi di database
  await prisma.transaction.update({
    where: { id: order_id },
    data: {
      status: transactionStatus,
      updatedAt: new Date()
    }
  });

  // Update payment di database
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