import { Header } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}