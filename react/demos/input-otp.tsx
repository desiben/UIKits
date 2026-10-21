import * as React from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/registry/facet/ui/input-otp"

export default function InputOTPDemo() {
  const [code, setCode] = React.useState("12")
  const status = code.length < 6 ? "idle" : code === "123456" ? "success" : "error"
  return (
    <div className="flex flex-col gap-3">
      <InputOTP maxLength={6} value={code} onChange={setCode} pattern={REGEXP_ONLY_DIGITS} status={status} aria-label="Verification code">
        <InputOTPGroup>
          <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {status === "success" ? <span className="font-medium text-success">Verified — welcome back.</span> : status === "error" ? <span className="font-medium text-danger">That code didn’t match. Try 123456.</span> : "Enter the 6-digit code we sent to you (hint: 123456)."}
      </p>
    </div>
  )
}
