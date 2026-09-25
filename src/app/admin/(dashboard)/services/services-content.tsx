"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { ServiceDialog } from "./service-dialog";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  published: boolean;
  price: number | null;
  country: { name: string; code: string } | null;
  _count: { applications: number };
  createdAt: Date;
}

export function ServicesContent({ services }: { services: Service[] }) {
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Content Management
          </p>
          <h1 className="mt-1 font-display text-3xl">Services</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage visa services, packages and pricing
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedService(null);
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> New Service
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-semibold">{services.length}</span>{" "}
            <span className="text-muted-foreground">total</span>
          </div>
          <div>
            <span className="font-semibold">
              {services.filter((s) => s.published).length}
            </span>{" "}
            <span className="text-muted-foreground">published</span>
          </div>
        </div>
      </div>

      {/* Services List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No services found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search"
                  : "Create your first service to get started"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <Card
              key={service.id}
              className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{service.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">
                      {service.slug}
                    </p>
                    {service.country && (
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {service.country.name}
                      </p>
                    )}
                    {service.price && (
                      <p className="mt-2 text-lg font-semibold text-primary">
                        £{service.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={service.published ? "default" : "secondary"}>
                    {service.published ? "Live" : "Draft"}
                  </Badge>
                </div>

                {service.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2 border-t pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => {
                      setSelectedService(service);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/services/${service.slug}`} target="_blank">
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                {service._count.applications > 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {service._count.applications} application
                    {service._count.applications !== 1 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ServiceDialog
        service={selectedService}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
