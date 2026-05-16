import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  service_type: string;
  message: string | null;
  status: string;
  created_at: string;
}

const statusOptions = ["pending", "contacted", "completed", "cancelled"];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    const { data, error } = await supabase
      .from("service_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch inquiries");
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  }

  const handleView = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDialogOpen(true);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase
      .from("service_inquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchInquiries();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    const { error } = await supabase.from("service_inquiries").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete inquiry");
    } else {
      toast.success("Inquiry deleted");
      fetchInquiries();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "contacted":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <AdminLayout title="Service Inquiries">
      <div className="mb-6">
        <p className="text-muted-foreground">
          View and manage service inquiries submitted through the website.
        </p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{selectedInquiry.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">
                  <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                    {selectedInquiry.email}
                  </a>
                </p>
              </div>
              {selectedInquiry.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">
                    <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Service Type</p>
                <p className="font-medium capitalize">{selectedInquiry.service_type.replace(/-/g, " ")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap">{selectedInquiry.message || "No message provided."}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {format(new Date(selectedInquiry.created_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No inquiries yet. Inquiries from the services form will appear here.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{inquiry.full_name}</p>
                      <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {inquiry.service_type.replace(/-/g, " ")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(inquiry.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) => handleStatusChange(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            <span className="capitalize">{status}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(inquiry)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(inquiry.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
