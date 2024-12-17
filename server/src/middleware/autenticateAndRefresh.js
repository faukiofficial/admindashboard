const jwt = require("jsonwebtoken");
const User = require("../api/users/model");

exports.autenticateAndRefresh = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      return next();
    }

    const refreshToken = req.cookies.refreshtoken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const newToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    res.cookie("token", newToken, {
      expires: new Date(Date.now() + 30 * 60 * 1000),
      maxAge: 30 * 60 * 1000,
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
