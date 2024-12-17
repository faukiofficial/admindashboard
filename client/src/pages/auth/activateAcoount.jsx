import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activateUser } from "../../redux/user/userSlice";
import { FaSpinner } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const ActivateAccount = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { activateToken, activateLoading, activateError } = useSelector(
    (state) => state.user
  );

  const location = useLocation();

  useEffect(() => {
    document.title = "Activate Account | Eduwork Marketplace";
  }, [location]);

  // Handle input change
  const handleChange = (value, index) => {
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

  // Submit the activation code
  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = code.join("");

    if (enteredCode.length < 4) {
      shakeInputs();
      return;
    }

    const data = {
      activation_token: activateToken,
      activation_code: Number(enteredCode),
    };

    const resultAction = await dispatch(activateUser(data));

    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/auth/login");
      setCode(["", "", "", ""]);
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
          Activate Your Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Check your email for the activation code
        </p>
        <p className="text-sm text-gray-600 text-center mb-4">
          Submit the code before{" "}
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-around">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className={`w-12 h-12 text-center text-lg font-semibold border ${
                  activateError ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 ${
                  activateError ? "focus:ring-red-500" : "focus:ring-green-400"
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded ${
              activateError
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {activateLoading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>

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

export default ActivateAccount;
