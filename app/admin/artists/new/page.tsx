"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ArrowLeft, Music, Loader2 } from "lucide-react";

type Concert = {
  id: number;
  concert_name: string;
};

export default function NewArtistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    concert_id: "",
    genre: "",
    reveal_date: "",
    bio: "",
    artist_image_url: "",
  });

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const res = await fetch("/api/admin/concerts");
        const data = await res.json();
        setConcerts(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConcerts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.concert_id || !formData.reveal_date) {
      alert("Name, Concert, and Reveal Date are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          concert_id: Number(formData.concert_id),
          genre: formData.genre || null,
          reveal_date: formData.reveal_date,
          bio: formData.bio || null,
          artist_image_url: formData.artist_image_url || null,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      alert("Artist created successfully!");
      router.push("/admin/artists");
    } catch (err: unknown) {
      alert("Failed to create artist: " + (err instanceof Error ? err.message : 'Failed to create artist'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <AdminPageHeader
        title="Add Artist"
        subtitle="New Performer"
        actions={
          <Link href="/admin/artists">
            <Button variant="outline" className="border-border/50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <Card className="border-border/40 max-w-2xl">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Artist Details</CardTitle>
              <CardDescription>Add a new concert performer</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Artist Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Artist name"
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Concert *</label>
                <Select value={formData.concert_id} onValueChange={(v) => setFormData({ ...formData, concert_id: v })}>
                  <SelectTrigger className="bg-muted/50 border-border/50">
                    <SelectValue placeholder="Select concert" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {concerts.map((concert) => (
                      <SelectItem key={concert.id} value={concert.id.toString()}>{concert.concert_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Genre</label>
                <Input
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="e.g., Pop, Rock, EDM"
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reveal Date *</label>
                <Input
                  type="date"
                  value={formData.reveal_date}
                  onChange={(e) => setFormData({ ...formData, reveal_date: e.target.value })}
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formData.artist_image_url}
                onChange={(e) => setFormData({ ...formData, artist_image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-muted/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                placeholder="Artist biography"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Artist"}
              </Button>
              <Link href="/admin/artists">
                <Button type="button" variant="outline" className="border-border/50">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
