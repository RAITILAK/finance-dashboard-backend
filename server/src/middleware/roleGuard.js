// Usage roleGuard(admin) or roleguard(admin, analyst)

const roleGuard = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: `Forbidden: Insufficient permissions. Required role(s): ${roles.join(" or ")}`,
        });
    }
    next();
  };
};

export default roleGuard;
