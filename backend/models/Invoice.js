const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    buyer: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    items: [
        {
            product: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
