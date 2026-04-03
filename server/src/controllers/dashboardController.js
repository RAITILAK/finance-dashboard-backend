import Transaction from "../models/Transaction.js";

const baseFilter = { isDeleted: false };

//GET /api/dashboard/summary
export const getSummary = async (req, res) => {
  try {
    const [income, expense, transactions] = await Promise.all([
      Transaction.aggregate([
        { $match: { ...baseFilter, type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { ...baseFilter, type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totolIncome = income[0]?.total || 0;
    const totolExpense = expense[0]?.total || 0;
    res.json({
      succeess: true,
      summary: {
        totalIncome: totolIncome,
        totalExpense: totolExpense,
        netBalance: totolIncome - totolExpense,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/by-category
export const getByCategory = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/dashboard/trends  (monthly)
export const getTrends = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/dashboard/recent
export const getRecent = async (req, res) => {
  try {
    const transactions = await Transaction.find(baseFilter)
      .populate("createdBy", "name")
      .sort("-date")
      .limit(8);
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
