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
    }]
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

module.exports = { getProducts, createTransaction, getTransactionHistory };