import Link from "next/link"
import { Megaphone, FileVideo, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProductManagerOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Manager</h1>
        <p className="text-muted-foreground mt-1">
          Manage content reward campaigns and review creator submissions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create and publish campaigns. Active campaigns appear on the discovery homepage.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/product-manager/campaigns/new">
                  <Plus className="h-4 w-4 mr-1" />
                  New campaign
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/product-manager/campaigns">View all</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="h-5 w-5" />
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Approve or reject video submissions from creators who joined your campaigns.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/product-manager/submissions">Review submissions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
