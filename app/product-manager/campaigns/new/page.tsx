import { CampaignForm } from "@/components/campaigns/campaign-form"

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create campaign</h1>
      <CampaignForm mode="create" />
    </div>
  )
}
