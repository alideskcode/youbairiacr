"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SubmissionWithRelations } from "@/lib/services/submission.service"
import { platformLabel } from "@/lib/campaign-utils"

export default function SubmissionsManagerPage() {
  const [submissions, setSubmissions] = useState<SubmissionWithRelations[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.set("status", statusFilter)
      const res = await fetch(`/api/submissions?${params}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setSubmissions(json.data.submissions)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed")
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    void load()
  }, [load])

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setActingId(id)
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success(`Submission ${status}`)
      void load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed")
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Submissions</h1>
          <p className="text-sm text-muted-foreground">
            Review creator video submissions across your campaigns.
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-sm">
                    {s.submitter?.full_name || s.submitter?.email || "—"}
                  </TableCell>
                  <TableCell>
                    {s.campaign ? (
                      <Link
                        href={`/campaign/${s.campaign.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {s.campaign.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {platformLabel(s.platform)}
                  </TableCell>
                  <TableCell>
                    <a
                      href={s.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[120px] inline-block"
                    >
                      View
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{s.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {s.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actingId === s.id}
                          onClick={() => updateStatus(s.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={actingId === s.id}
                          onClick={() => updateStatus(s.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
