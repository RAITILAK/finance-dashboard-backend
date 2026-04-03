import Transaction from "../models/Transaction.js";

//POST /api/transactions

export const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    if (!amount || !type || !category) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Amount, type and category are required",
        });
    }

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//GET /api/transactions (filters: type, category,form,to,page,limit)
export const getTransactions = async (req, res) => {
  try {
    const { type, category, from, to, page = 1, limit = 10 } = req.query;
    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort("-date")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true },
    );
    if (!transaction)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/transactions/:id  (soft delete)
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true },
    );
    if (!transaction)
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
