const { Payment, Loan } = require('../models');

module.exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Loan, attributes: ['uuid', 'LoanAmount'] }]
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

module.exports.createPayment = async (req, res) => {
  try {
    const newPayment = await Payment.create(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: "Error creating payment", error: error.message });
  }
};

module.exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Loan, attributes: ['uuid', 'LoanAmount'] }]
    });
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error: error.message });
  }
};

module.exports.updatePayment = async (req, res) => {
  try {
    const [updated] = await Payment.update(req.body, {
      where: { uuid: req.params.id }
    });
    if (updated) {
      const updatedPayment = await Payment.findByPk(req.params.id);
      res.status(200).json(updatedPayment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating payment", error: error.message });
  }
};

module.exports.deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.destroy({
      where: { uuid: req.params.id }
    });
    if (deleted) {
      res.status(204).send("Payment deleted");
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
};