import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-edge flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="font-display text-7xl tracking-tight">404</span>
      <h1 className="mt-2 font-display text-2xl">Page not found.</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}