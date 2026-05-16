import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Event {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  date_time: string;
  price_vip: number | null;
  price_regular: number | null;
  price_advance: number | null;
  ticket_link: string | null;
  image_url: string | null;
  is_public: boolean;
  created_at: string;
}

const emptyEvent = {
  name: "",
  description: "",
  location: "",
  date_time: "",
  price_vip: 0,
  price_regular: 0,
  price_advance: 0,
  ticket_link: "",
  image_url: "",
  is_public: true,
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [formData, setFormData] = useState(emptyEvent);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date_time", { ascending: true });

    if (error) {
      toast.error("Failed to fetch events");
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description || "",
      location: event.location || "",
      date_time: event.date_time ? format(new Date(event.date_time), "yyyy-MM-dd'T'HH:mm") : "",
      price_vip: event.price_vip || 0,
      price_regular: event.price_regular || 0,
      price_advance: event.price_advance || 0,
      ticket_link: event.ticket_link || "",
      image_url: event.image_url || "",
      is_public: event.is_public,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData(emptyEvent);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const eventData = {
      name: formData.name,
      description: formData.description || null,
      location: formData.location || null,
      date_time: formData.date_time,
      price_vip: formData.price_vip || null,
      price_regular: formData.price_regular || null,
      price_advance: formData.price_advance || null,
      ticket_link: formData.ticket_link || null,
      image_url: formData.image_url || null,
      is_public: formData.is_public,
    };

    if (editingEvent?.id) {
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", editingEvent.id);

      if (error) {
        toast.error("Failed to update event");
      } else {
        toast.success("Event updated");
        setDialogOpen(false);
        fetchEvents();
      }
    } else {
      const { error } = await supabase.from("events").insert(eventData);

      if (error) {
        toast.error("Failed to create event");
      } else {
        toast.success("Event created");
        setDialogOpen(false);
        fetchEvents();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete event");
    } else {
      toast.success("Event deleted");
      fetchEvents();
    }
  };

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString("en-KE")}`;
  };

  return (
    <AdminLayout title="Events">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage your events and workshops. Public events will be displayed on the events page.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="date_time">Date & Time *</Label>
                <Input
                  id="date_time"
                  type="datetime-local"
                  value={formData.date_time}
                  onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Virtual (Zoom) or In-Person (City)"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Event Poster/Image"
                folder="events"
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price_advance">Advance (KES)</Label>
                  <Input
                    id="price_advance"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price_advance}
                    onChange={(e) => setFormData({ ...formData, price_advance: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="price_regular">Regular (KES)</Label>
                  <Input
                    id="price_regular"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price_regular}
                    onChange={(e) => setFormData({ ...formData, price_regular: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="price_vip">VIP (KES)</Label>
                  <Input
                    id="price_vip"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price_vip}
                    onChange={(e) => setFormData({ ...formData, price_vip: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ticket_link">Ticket Link</Label>
                <Input
                  id="ticket_link"
                  type="url"
                  value={formData.ticket_link}
                  onChange={(e) => setFormData({ ...formData, ticket_link: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
                <Label htmlFor="is_public">Public (visible on events page)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingEvent ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No events yet. Click "Add Event" to create one.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{format(new Date(event.date_time), "MMM d, yyyy h:mm a")}</TableCell>
                  <TableCell>{event.location || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.is_public
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {event.is_public ? "Public" : "Private"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(event)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
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
