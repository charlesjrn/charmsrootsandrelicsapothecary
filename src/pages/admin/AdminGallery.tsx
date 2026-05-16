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
import { Plus, Pencil, Trash2, Loader2, Calendar, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  event_name: string;
  event_date: string;
  active: boolean;
  created_at: string;
}

const emptyImage = {
  title: "",
  description: "",
  image_url: "",
  event_name: "",
  event_date: "",
  active: true,
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Partial<GalleryImage> | null>(null);
  const [formData, setFormData] = useState(emptyImage);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("event_date", { ascending: false });

    if (error) {
      toast.error("Failed to fetch gallery images");
      console.error(error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
      event_name: image.event_name,
      event_date: image.event_date,
      active: image.active,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingImage(null);
    setFormData(emptyImage);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const imageData = {
      title: formData.title,
      description: formData.description || null,
      image_url: formData.image_url,
      event_name: formData.event_name,
      event_date: formData.event_date,
      active: formData.active,
    };

    if (editingImage?.id) {
      const { error } = await supabase
        .from("gallery_images")
        .update(imageData)
        .eq("id", editingImage.id);

      if (error) {
        toast.error("Failed to update image");
        console.error(error);
      } else {
        toast.success("Image updated");
        setDialogOpen(false);
        fetchImages();
      }
    } else {
      const { error } = await supabase.from("gallery_images").insert(imageData);

      if (error) {
        toast.error("Failed to create image");
        console.error(error);
      } else {
        toast.success("Image created");
        setDialogOpen(false);
        fetchImages();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete image");
      console.error(error);
    } else {
      toast.success("Image deleted");
      fetchImages();
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from("gallery_images")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update image status");
      console.error(error);
    } else {
      toast.success(`Image ${!currentActive ? "published" : "hidden"}`);
      fetchImages();
    }
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage your event gallery images. Only active images will be visible on the public gallery page.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? "Edit Image" : "Add New Image"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Opening Ceremony"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Brief description of the image..."
                />
              </div>

              <div>
                <Label htmlFor="event_name">Event Name *</Label>
                <Input
                  id="event_name"
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  required
                  placeholder="e.g., Annual Spiritual Gathering 2024"
                />
              </div>

              <div>
                <Label htmlFor="event_date">Event Date *</Label>
                <Input
                  id="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>

              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Image"
                folder="gallery"
                required
              />

              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Active (visible on public gallery)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingImage ? "Update" : "Create"}
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
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No gallery images yet. Click "Add Image" to create one.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    {image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={image.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{image.title}</TableCell>
                  <TableCell>{image.event_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">
                        {format(new Date(image.event_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(image.id, image.active)}
                      className="cursor-pointer"
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          image.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {image.active ? "Active" : "Hidden"}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(image.created_at), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(image)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(image.id)}
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