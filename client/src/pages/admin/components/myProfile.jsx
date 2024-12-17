import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import {
  activateChangedPassword,
  activateChangeEmail,
  changePasswordRequest,
  deleteAccount,
  updateUserInfo,
} from "../../../redux/user/userSlice";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useLocation } from "react-router-dom";

const MyProfile = () => {
  const dispatch = useDispatch();
  const {
    user,
    updateUserInfoLoading,
    changeEmailToken,
    activateChangedEmailLoading,
    activateChangedEmailError,
    changePasswordRequestLoading,
    changePasswordToken,
    activateChangedPasswordLoading,
    activateChangedPasswordError,
    deleteAccountLoading,
  } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const [activateModal, setActivateModal] = useState(false);
  const [activationCode, setActivationCode] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const inputRefs = useRef([]);

  const [chaangePasswordModal, setChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [changePasswordActivateModal, setChangePasswordActivateModal] =
    useState(false);

  
    const location = useLocation();

    useEffect(() => {
      document.title = "My Profile | Eduwork Marketplace";
    }, [location]);

  useEffect(() => {
    if (changeEmailToken) {
      setActivateModal(true);
    }
  }, [changeEmailToken]);

  useEffect(() => {
    if (changePasswordToken) {
      setChangePasswordActivateModal(true);
    }
  }, [changePasswordToken]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
      });
    }
  }, [user]);

  //   Edit Profile
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserInfo(formData));
  };
  //   End Edit Profile

  // Activate Email Change
  const handleActivationChange = (value, index) => {
    if (isNaN(value) || value.length > 1) return;
    const newCode = [...activationCode];
    newCode[index] = value;
    setActivationCode(newCode);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleActivationSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = activationCode.join("");
    if (enteredCode.length < 4) return;

    const data = {
      activation_token: changeEmailToken,
      activation_code: Number(enteredCode),
    };

    const resultAction = await dispatch(activateChangeEmail(data));

    if (resultAction.meta.requestStatus === "fulfilled") {
      setActivateModal(false);
      setActivationCode(["", "", "", ""]);
    }
  };
  //   End Activate Email Change

  // Change Password Activation
  const handleChangePasswordActivation = async (e) => {
    e.preventDefault();
    const enteredCode = activationCode.join("");
    if (enteredCode.length < 4) return;

    const data = {
      activation_token: changePasswordToken,
      activation_code: Number(enteredCode),
      new_password: newPassword,
    };

    const resultAction = await dispatch(activateChangedPassword(data));

    if (resultAction.meta.requestStatus === "fulfilled") {
      setChangePasswordActivateModal(false);
      setActivationCode(["", "", "", ""]);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Format countdown as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // Change password request
  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      changePasswordRequest({ old_password: oldPassword })
    );

    if (resultAction.meta.requestStatus === "fulfilled") {
      setChangePasswordModal(false);
    }
  };

  // delete account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    dispatch(deleteAccount());
  };

  return (
    <div className="p-6 bg-white w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
        <div className="flex gap-4">
        <div
          className="text-green-700 underline hover:text-green-600 cursor-pointer"
          onClick={() => setChangePasswordModal(true)}
        >
          Change Password
        </div>
        <div
          className="text-red-700 underline hover:text-red-600 cursor-pointer"
          onClick={() => setDeleteAccountModal(true)}
        >
          Delete Account
        </div>
        </div>
      </div>
      <form
        onSubmit={handleProfileSubmit}
        className="space-y-6 max-w-[900px] mx-auto"
      >
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
            required
          />
          <p className="text-sm text-gray-600 mt-2">
            You need to verify your new email if you want to change it
          </p>
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-semibold rounded ${
            updateUserInfoLoading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {updateUserInfoLoading ? (
            <FaSpinner className="animate-spin mx-auto" />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>

      {activateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
              Activate Your Account
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter the 4-digit activation code sent to your email.
            </p>
            <p className="text-sm text-gray-600 text-center mb-4">
              Submit the code before{" "}
              <span className="font-semibold">{formatTime(timeLeft)}</span>
            </p>
            <form onSubmit={handleActivationSubmit} className="space-y-4">
              <div className="flex justify-around">
                {activationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) =>
                      handleActivationChange(e.target.value, index)
                    }
                    maxLength={1}
                    className={`w-12 h-12 text-center text-lg font-semibold border ${
                      activateChangedEmailError
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded focus:outline-none focus:ring-2 ${
                      activateChangedEmailError
                        ? "focus:ring-red-500"
                        : "focus:ring-green-400"
                    }`}
                  />
                ))}
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 text-white font-semibold rounded ${
                  activateChangedEmailLoading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {activateChangedEmailLoading ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
            <p
              className="text-sm text-gray-600 mt-2 -mb-3 hover:underline cursor-pointer"
              onClick={() => {
                setActivateModal(false);
                window.location.reload();
              }}
            >
              Cancel
            </p>
          </div>
        </div>
      )}

      {chaangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
              Change Password
            </h2>
            <form onSubmit={handleSubmitChangePassword} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Old Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 text-white font-semibold rounded ${
                  changePasswordRequestLoading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {changePasswordRequestLoading ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
            <p
              className="text-sm text-gray-600 mt-4 hover:underline cursor-pointer text-center"
              onClick={() => {
                setChangePasswordModal(false);
                setOldPassword("");
              }}
            >
              Cancel
            </p>
          </div>
        </div>
      )}

      {changePasswordActivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
              Change New Password
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter the 4-digit activation code sent to your email.
            </p>
            <p className="text-sm text-gray-600 text-center mb-4">
              Submit the code before{" "}
              <span className="font-semibold">{formatTime(timeLeft)}</span>
            </p>
            <form
              onSubmit={handleChangePasswordActivation}
              className="space-y-4"
            >
              <div className="flex justify-around">
                {activationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) =>
                      handleActivationChange(e.target.value, index)
                    }
                    maxLength={1}
                    className={`w-12 h-12 text-center text-lg font-semibold border ${
                      activateChangedPasswordError
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded focus:outline-none focus:ring-2 ${
                      activateChangedPasswordError
                        ? "focus:ring-red-500"
                        : "focus:ring-green-400"
                    }`}
                  />
                ))}
              </div>

              {/* New Password Input */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 text-white font-semibold rounded ${
                  activateChangedPasswordLoading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {activateChangedPasswordLoading ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
            <p
              className="text-sm text-gray-600 mt-2 -mb-3 hover:underline cursor-pointer"
              onClick={() => {
                handleChangePasswordActivation(false);
                window.location.reload();
              }}
            >
              Cancel
            </p>
          </div>
        </div>
      )}

      {deleteAccountModal && (
        <ConfirmationModal
          title={"Delete Account"}
          message={"Are you sure you want to delete your account"}
          cancel={() => setDeleteAccountModal(false)}
          confirm={handleDeleteAccount}
          loading={deleteAccountLoading}
          buttonColor={"bg-red-500 hover:bg-red-600"}
          buttonText={"Delete"}
        />
      )}
    </div>
  );
};

export default MyProfile;
