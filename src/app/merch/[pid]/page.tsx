import { use } from "react"
import MerchView from "./merch-details"

export default function MerchPage({ params }: { params: { pid: string } }) {
  return <MerchView pid={params.pid} />
}
