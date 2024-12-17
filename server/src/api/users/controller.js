const { sendEmail } = require("../../utils/sendMail");
const User = require("./model");
const jwt = require("jsonwebtoken");
const path = require("path");
const ejs = require("ejs");
const bcrypt = require("bcryptjs");

// register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const userData = {
      name,
      email,
      password,
      phone_number,
    };

    const activation_token = createActivationToken(userData);

    const activation_code = activation_token.activationCode;

    const data = {
      user: {
        name,
        email,
        phone_number,
      },
      activation_code,
    };

    ejs.renderFile(
      path.join(__dirname, "../../mailing/activationMail.ejs"),
      data
    );

    try {
      await sendEmail({
        email: userData.email,
        subject: `${activation_code} is your activation code`,
        template: "activationMail.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: "Registration successful and need to activate account",
        email: userData.email,
        activation_token: activation_token.token,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

const createActivationToken = (payload) => {
  const activationCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
  const token = jwt.sign(
    { payload, activationCode },
    process.env.ACTIVATION_TOKEN_SECRET,
    { expiresIn: "30m" }
  );

  return { token, activationCode };
};

exports.activateUser = async (req, res) => {
  try {
    const { activation_token, activation_code } = req.body;

    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    if (newUser.activationCode !== activation_code) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation code",
      });
    }

    const { name, email, password, phone_number } = newUser.payload;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const userData = {
      name,
      email,
      password,
      phone_number,
    };

    const user = await User.create(userData);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User successfully activated",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User activation failed",
    });
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 30 * 60 * 1000),
      maxAge: 30 * 60 * 1000,
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.cookie("refreshtoken", refreshToken, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshtoken");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// get user info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      message: "User info fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User info fetching failed",
    });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const {
      name,
      limit = 25,
      page = 1,
      sortField = "updatedAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (name) {
      query.$or = [
        { name: { $regex: name, $options: "i" } },
        { email: { $regex: name, $options: "i" } }
      ];
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortField]: sortOrder })
      .select("-password");

      const totalUsers = await User.countDocuments();
      const totalFilteredUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalFilteredUsers / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Users fetching failed",
    });
  }
};

// update user info and address
exports.updateUserInfo = async (req, res) => {
  try {
    const { name, email, phone_number, address } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const activation_token = createActivationToken({
        email,
        name,
        phone_number,
        address,
      });

      const activation_code = activation_token.activationCode;

      const data = {
        user: {
          name: name || user.name,
          email,
          phone_number: phone_number || user.phone_number,
          address: address || user.address || "",
        },
        activation_code,
      };

      ejs.renderFile(
        path.join(__dirname, "../../mailing/emailChangeMail.ejs"),
        data
      );

      await sendEmail({
        email,
        subject: `${activation_code} is your activation code`,
        template: "emailChangeMail.ejs",
        data,
      });

      return res.status(200).json({
        success: true,
        message:
          "Email update requested. Please activate the new email address.",
        activation_token: activation_token.token,
      });
    }

    user.name = name || user.name;
    user.phone_number = phone_number || user.phone_number;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User info updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User info updating failed",
    });
  }
};

// activate changed email
exports.activateChangedEmail = async (req, res) => {
  try {
    const { activation_code, activation_token } = req.body;

    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation token",
      });
    }

    if (newUser.activationCode !== activation_code) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation code",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.email = newUser.payload.email;
    user.name = newUser.payload.name;
    user.phone_number = newUser.payload.phone_number;
    user.address = newUser.payload.address;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Email updating failed",
    });
  }
};

// update user password and sent email to user
exports.updateUserPassword = async (req, res) => {
  try {
    const { old_password } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (old_password) {
      const isMatch = await bcrypt.compare(old_password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }
    }

    const activation_token = createActivationToken({
      email: user.email,
      name: user.name,
      phone_number: user.phone_number,
      address: user.address,
    });

    const activation_code = activation_token.activationCode;

    const data = {
      user: {
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
      },
      activation_code,
    };

    ejs.renderFile(
      path.join(__dirname, "../../mailing/changePasswordConfirm.ejs"),
      data
    );

    await sendEmail({
      email: user.email,
      subject: `${activation_code} is your activation code`,
      template: "changePasswordConfirm.ejs",
      data,
    });

    res.status(200).json({
      success: true,
      message: "Password update requested. Please activate the new password.",
      activation_token: activation_token.token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Password updating failed",
    });
  }
};

// activate changed password
exports.activateChangedPassword = async (req, res) => {
  try {
    const { activation_code, new_password, activation_token } = req.body;

    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation token",
      });
    }

    if (newUser.activationCode !== activation_code) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation code",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = new_password;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Password updating failed",
    });
  }
};

// forget password
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const activation_token = createActivationToken({
      email: user.email,
      name: user.name,
      phone_number: user.phone_number,
      address: user.address,
    });

    const activation_code = activation_token.activationCode;

    const data = {
      user: {
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
      },
      activation_code,
    };

    ejs.renderFile(
      path.join(__dirname, "../../mailing/forgetPassword.ejs"),
      data
    );

    await sendEmail({
      email: user.email,
      subject: `${activation_code} is your activation code`,
      template: "forgetPassword.ejs",
      data,
    });

    res.status(200).json({
      success: true,
      message: "Password update requested. Please activate the new password.",
      activation_token: activation_token.token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Password updating failed",
    });
  }
};

// set new password
exports.setNewPassword = async (req, res) => {
  try {
    const { activation_code, activation_token, new_password } = req.body;

    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation token",
      });
    }

    if (newUser.activationCode !== activation_code) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation code",
      });
    }

    const user = await User.findOne({ email: newUser.payload.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = new_password;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Password updating failed",
    });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Account deleting failed",
    });
  }
};
