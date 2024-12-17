import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordActivation } from "../../redux/user/userSlice";

const ResetPasswordActivation = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { resetPasswordActicationLoading, fogertPasswordToken, resetPasswordActicationError } = useSelector(
    (state) => state.user
  );

  
  const location = useLocation();

  useEffect(() => {
    document.title = "Reset Password Activation | Eduwork Marketplace";
  }, [location]);

  // Handle input change for activation code
  const handleCodeChange = (value, index) => {
    if (isNaN(value) || value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to the next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and move to previous input
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Submit the activation code and new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = code.join("");

    if (enteredCode.length < 4 || !newPassword) {
      shakeInputs();
      return;
    }

    const data = {
      activation_code: Number(enteredCode),
      new_password: newPassword,
      activation_token: fogertPasswordToken,
    };

    const resultAction = await dispatch(resetPasswordActivation(data));

    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/auth/login");
      setCode(["", "", "", ""]);
      setNewPassword("");
    }
  };

  // Shake input boxes on error
  const shakeInputs = () => {
    inputRefs.current.forEach((input) => {
      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 500);
    });
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter the activation code and your new password.
        </p>
        <p className="text-sm text-gray-600 text-center mb-4">
          Submit the code before{" "}
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Activation Code Inputs */}
          <div className="flex justify-around">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className={`w-12 h-12 text-center text-lg font-semibold border ${
                  resetPasswordActicationError ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 ${
                  resetPasswordActicationError ? "focus:ring-red-500" : "focus:ring-green-400"
                }`}
              />
            ))}
          </div>

          {/* New Password Input */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded ${
              resetPasswordActicationError
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {resetPasswordActicationLoading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>

      {/* Animation for shake effect */}
      <style>{`
        .shake {
          animation: shake 0.5s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordActivation;
