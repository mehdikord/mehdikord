import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/server/auth";

export default async function PanelLayout({ children }: LayoutProps<"/administrator">) {
  const admin = await requireAdmin();
  return <AdminShell admin={{ name: admin.name, phone: admin.phone }}>{children}</AdminShell>;
}
