// C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\confirm-email\page.tsx

import { Suspense } from "react"
import ConfirmEmailClient from "./ConfirmEmailClient"

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <ConfirmEmailClient />
    </Suspense>
  )
}
