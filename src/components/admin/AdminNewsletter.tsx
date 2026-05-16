import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send, Mail, Users, FileText, Trash2, Eye, Download } from "lucide-react";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
  unsubscribed_at: string | null;
}

interface Campaign {
  id: string;
  subject: string;
  content: string;
  campaign_status: string;
  sent_count: number;
  failed_count: number;
  sent_at: string;
  created_at: string;
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
  }, []);

  async function fetchSubscribers() {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch subscribers");
      console.error(error);
    } else {
      setSubscribers(data || []);
    }
    setLoading(false);
  }

  async function fetchCampaigns() {
    const { data, error } = await supabase
      .from("newsletter_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch campaigns");
      console.error(error);
    } else {
      setCampaigns(data || []);
    }
  }

  async function sendNewsletter() {
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter newsletter content");
      return;
    }

    setSending(true);
    try {
      // Get all active subscribers
      const { data: subscribersList, error: fetchError } = await supabase
        .from("subscribers")
        .select("id, email")
        .eq("is_active", true);

      if (fetchError) throw fetchError;

      if (!subscribersList || subscribersList.length === 0) {
        toast.error("No subscribers found");
        setSending(false);
        return;
      }

      // Create campaign record
      const { data: campaign, error: campaignError } = await supabase
        .from("newsletter_campaigns")
        .insert({
          subject,
          content,
          campaign_status: "sending",
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Send emails (simulated for now)
      let sentCount = 0;
      let failedCount = 0;

      for (const subscriber of subscribersList) {
        try {
          // Here you would integrate with an email service
          console.log(`Sending to ${subscriber.email}:`, { subject, content });
          
          // Log the send attempt
          await supabase.from("newsletter_logs").insert({
            campaign_id: campaign.id,
            subscriber_id: subscriber.id,
            log_status: "sent",
          });
          
          sentCount++;
        } catch (error: any) {
          failedCount++;
          await supabase.from("newsletter_logs").insert({
            campaign_id: campaign.id,
            subscriber_id: subscriber.id,
            log_status: "failed",
            error_message: error.message,
          });
        }
      }

      // Update campaign status
      await supabase
        .from("newsletter_campaigns")
        .update({
          campaign_status: "sent",
          sent_count: sentCount,
          failed_count: failedCount,
          sent_at: new Date().toISOString(),
        })
        .eq("id", campaign.id);

      toast.success(`Newsletter sent to ${sentCount} subscribers!`);
      setSubject("");
      setContent("");
      fetchCampaigns();
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Failed to send newsletter");
    } finally {
      setSending(false);
    }
  }

  async function exportSubscribers() {
    const { data: allSubscribers } = await supabase
      .from("subscribers")
      .select("*")
      .eq("is_active", true);

    if (!allSubscribers || allSubscribers.length === 0) {
      toast.error("No subscribers to export");
      return;
    }

    const csvData = allSubscribers.map(sub => ({
      Email: sub.email,
      "Subscribed Date": format(new Date(sub.created_at), "MMM d, yyyy HH:mm"),
      Status: sub.is_active ? "Active" : "Inactive",
    }));

    const csvHeaders = Object.keys(csvData[0]).join(",");
    const csvRows = csvData.map(row => Object.values(row).join(","));
    const csv = [csvHeaders, ...csvRows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Subscribers exported successfully");
  }

  async function deleteSubscriber(id: string) {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    const { error } = await supabase
      .from("subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to remove subscriber");
    } else {
      toast.success("Subscriber removed");
      fetchSubscribers();
    }
  }

  const activeSubscribers = subscribers.filter(s => s.is_active).length;

  return (
    <AdminLayout title="Newsletter Management">
      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compose">
            <Mail className="w-4 h-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users className="w-4 h-4 mr-2" />
            Subscribers ({activeSubscribers})
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <FileText className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Send Newsletter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter newsletter subject..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your newsletter content here..."
                  rows={12}
                  className="mt-1 font-mono"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPreviewOpen(true)}
                  disabled={!subject || !content}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={sendNewsletter}
                  disabled={sending || !subject || !content}
                  className="flex-1"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending to {activeSubscribers} subscribers...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send to {activeSubscribers} Subscribers
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Newsletter Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Keep your subject line concise and engaging (under 50 characters)</li>
                  <li>Personalize your content when possible</li>
                  <li>Include a clear call-to-action</li>
                  <li>Test your newsletter before sending to all subscribers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Email Subscribers</CardTitle>
              <Button onClick={exportSubscribers} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No subscribers yet. Share your newsletter signup form!
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Subscribed Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">{subscriber.email}</TableCell>
                          <TableCell>
                            {format(new Date(subscriber.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                              {subscriber.is_active ? "Active" : "Unsubscribed"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSubscriber(subscriber.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Sent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No campaigns sent yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{campaign.subject}</h3>
                              <Badge
                                variant={
                                  campaign.campaign_status === "sent" ? "default" : "secondary"
                                }
                              >
                                {campaign.campaign_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {campaign.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Created: {format(new Date(campaign.created_at), "MMM d, yyyy")}</span>
                              {campaign.campaign_status === "sent" && campaign.sent_at && (
                                <span>Sent: {format(new Date(campaign.sent_at), "MMM d, yyyy")}</span>
                              )}
                              {campaign.campaign_status === "sent" && (
                                <>
                                  <span>✓ {campaign.sent_count} delivered</span>
                                  {campaign.failed_count > 0 && (
                                    <span>✗ {campaign.failed_count} failed</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setPreviewOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Newsletter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{selectedCampaign?.subject || subject}</h3>
              <div className="mt-4 prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">
                  {selectedCampaign?.content || content}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}