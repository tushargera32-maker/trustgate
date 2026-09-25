"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateLeadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    hub: "",
    service: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || null,
        hub: form.hub || null,
        service: form.service || null,
        notes: form.notes || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/leads");
    } else {
      alert("Failed to create lead");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/leads">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Leads
          </Link>
        </Button>
      </div>
      <h1 className="font-display text-2xl mb-4">Create New Lead</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="hub">Hub / Origin</Label>
          <Input id="hub" name="hub" value={form.hub} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="service">Service / Destination</Label>
          <Input id="service" name="service" value={form.service} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="block w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Saving…" : "Create Lead"}
        </Button>
      </form>
    </div>
  );
}
