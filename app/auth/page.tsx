"use client"

import type React from "react"
import {
  useState,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react"
import Link from "next/link"
import Image from "next/image"

type View = "login" | "register" | "otp" | "forgot"

export default function AuthFlipPage() {
  const [view, setView] = useState<View>("login")

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Joker Card Image (shared) */}
      <div className="fixed hidden md:flex md:w-1/2 h-full bg-[#1a1a1a]">
        {/* Dice Logo */}
        <div className="absolute top-8 left-8 z-10">
          <div className="relative w-16 h-16">
            <Image
              src="/Synapse Logo.png"
              alt="Synapse Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Joker Card Background Image */}
        <Image
          src="/joker.jpg"
          alt="Joker Card"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-black pointer-events-none" />
      </div>

      {/* Right Side - Flip Container */}
      <div className="flex w-full md:w-1/2 md:ml-auto items-center justify-center bg-[#050505] px-6 py-12">
        <div className="w-full max-w-[582px] [perspective:1200px] flex items-center justify-center min-h-[600px]">
          <div
            className={`
              relative w-full
              transition-transform duration-700
              [transform-style:preserve-3d]
              ${view === "login" || view === "otp"
                ? "[transform:rotateY(0deg)]"
                : "[transform:rotateY(180deg)]"
              }
            `}
          >
            {/* FRONT: Login + OTP */}
            <div
              className={`[backface-visibility:hidden] flex items-center justify-center ${view === "login" || view === "otp" ? "relative" : "absolute inset-0"
                }`}
            >
              {view === "login" && (
                <LoginBox
                  goRegister={() => setView("register")}
                  goForgot={() => setView("forgot")}
                />
              )}
              {view === "otp" && (
                <OtpBox
                  goLogin={() => setView("login")}
                />
              )}
            </div>

            {/* BACK: Register + Forgot */}
            <div
              className={`[backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center ${view === "register" || view === "forgot" ? "relative" : "absolute inset-0"
                }`}
            >
              {view === "register" && (
                <RegisterBox
                  goLogin={() => setView("login")}
                  goOtp={() => setView("otp")}
                />
              )}
              {view === "forgot" && (
                <ForgotPasswordBox
                  goLogin={() => setView("login")}
                  goRegister={() => setView("register")}
                  goOtp={() => setView("otp")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==================== LOGIN BOX (right side of your original LoginPage) ==================== */

function LoginBox({
  goRegister,
  goForgot,
}: {
  goRegister: () => void
  goForgot: () => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login submitted:", formData)
  }

  return (
    <div className="w-full max-w-[515px]">
      {/* Title */}
      <h1 className="text-center text-white text-[40px] md:text-[50px] leading-[1.1] font-joker mb-16 tracking-wide">
        welcome back to
        <br />
        the game
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="E.g. rsharma@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3.5 bg-transparent border border-white rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-all text-base font-poppins"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3.5 bg-transparent border border-white rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-all text-base pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Forgotten Password Link */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-white/80 text-sm underline hover:text-white transition-colors font-poppins"
            onClick={(e) => {
              e.preventDefault()
              goForgot()
            }}
          >
            Forgotten your password?
          </Link>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full bg-white text-black py-3.5 rounded-md text-2xl hover:bg-white/90 transition-colors mt-2 font-jqka cursor-pointer"
        >
          Continue
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-white/70 text-base mt-4 font-sans">
          Don&apos;t have an account?{" "}
          <button
            onClick={goRegister}
            className="text-[#dc2626] hover:underline font-poppins font-medium cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  )
}

/* ==================== REGISTER BOX (right side of your original RegisterPage) ==================== */

function RegisterBox({
  goLogin,
  goOtp,
}: {
  goLogin: () => void
  goOtp: () => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 font-joker">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
          the cards are dealt
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">
          join in
        </h2>
      </div>

      {/* Registration Form */}
      <div className="space-y-4 border border-white/20 p-8 rounded-lg">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="E.g. Aditya"
            className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="text"
            placeholder="E.g. Sharma"
            className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        {/* Phone Number */}
        <div className="flex gap-2">
          <select className="w-32 px-3 py-3 bg-transparent border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50">
            <option value="91" className="bg-black">
              INR(+91)
            </option>
            <option value="1" className="bg-black">
              USA(+1)
            </option>
            <option value="44" className="bg-black">
              UK(+44)
            </option>
          </select>
          <input
            type="tel"
            placeholder="12345 67890"
            className="flex-1 px-4 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        {/* Date of Birth and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="DOB: DD/MM/YYYY"
              className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 pr-10"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <select className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50">
            <option value="" className="bg-black">
              Gender
            </option>
            <option value="male" className="bg-black">
              Male
            </option>
            <option value="female" className="bg-black">
              Female
            </option>
            <option value="other" className="bg-black">
              Other
            </option>
            <option value="prefer-not-to-say" className="bg-black">
              Prefer not to say
            </option>
          </select>
        </div>

        {/* College Name */}
        <input
          type="text"
          placeholder="E.g. College name like ITB, DAICT, Nirma university"
          className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="E.g. rsharma@gmail.com"
          className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showPassword ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showConfirmPassword ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Get OTP Button */}
        <button
          className="w-full bg-white text-black hover:bg-gray-100 text-2xl h-12 rounded-md transition-colors cursor-pointer font-jqka"
          type="button"
          onClick={goOtp}
        >
          Get OTP
        </button>

        {/* Login Link */}
        <p className="text-center text-white text-sm font-sans">
          If you already have an account?{" "}
          <button
            onClick={goLogin}
            className="text-red-500 hover:text-red-400 font-poppins font-semibold cursor-pointer"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  )
}

/* ==================== OTP BOX (right side of your original OTPPage) ==================== */

function OtpBox({ goLogin }: { goLogin: () => void }) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    const lastIndex = Math.min(pastedData.length, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("OTP submitted:", otp.join(""))
  }

  return (
    <div className="w-full max-w-[542px]">
      <h1 className="font-joker mb-12 text-center text-4xl leading-tight tracking-wide text-white">
        the cards are dealt
        <br />
        join in
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Instructions */}
        <div className="mb-8 text-center">
          <p className="font-poppins text-sm text-white/80">
            Enter the code from the SMS sent
            <br />
            to the email
          </p>
        </div>

        {/* OTP Input Boxes */}
        <div className="mb-6 flex justify-center gap-[18px]">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-[95px] w-[68px] rounded border border-white/70 bg-transparent text-center font-card text-3xl text-white transition-colors focus:border-white focus:outline-none"
            />
          ))}
        </div>

        {/* Resend Code Link */}
        <div className="mb-8 text-center">
          <button
            type="button"
            className="font-poppins text-sm text-white underline hover:text-white/80 cursor-pointer"
          >
            Send the code again
          </button>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full rounded bg-white py-4 font-jqka text-2xl cursor-pointer text-black transition-colors hover:bg-white/90"
        >
          Continue
        </button>

        {/* Back to login link */}
        <p className="mt-4 text-center">
          <button
            onClick={goLogin}
            className="text-white/80 text-sm underline hover:text-white cursor-pointer"
          >
            Back to login
          </button>
        </p>
      </form>
    </div>
  )
}

/* ==================== FORGOT PASSWORD BOX (right side of your original ForgotPasswordPage) ==================== */

function ForgotPasswordBox({
  goLogin,
  goRegister,
  goOtp,
}: {
  goLogin: () => void
  goRegister: () => void
  goOtp: () => void
}) {
  return (
    <div className="w-full max-w-[582px] space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-29">
        <h1 className="text-3xl md:text-4xl font-joker lowercase text-white tracking-wider">
          RESET YOUR
          <br />
          PASSWORD
        </h1>
      </div>

      {/* Reset Password Form */}
      <div className="space-y-6 mt-6">
        {/* Email Input */}
        <input
          type="email"
          placeholder="E.g. rsharma@gmail.com"
          className="w-full px-4 py-3 bg-transparent border border-white rounded-md text-white font-poppins placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        {/* Get OTP Button */}
        <button
          className="w-full bg-white text-black hover:bg-gray-100 font-jqka text-2xl h-12 rounded-md transition-colors cursor-pointer"
          type="button"
          onClick={goOtp}
        >
          Get OTP
        </button>

        {/* Sign Up Link */}
        <p className="text-center font-sans text-white text-sm">
          Don&apos;t have an account?{" "}
          <button
            onClick={goRegister}
            className="text-red-500 hover:text-red-400 font-semibold cursor-pointer"
          >
            Sign up
          </button>
        </p>

        {/* Back to login link */}
        <p className="text-center">
          <button
            onClick={goLogin}
            className="text-white/80 text-sm underline hover:text-white cursor-pointer"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  )
}
