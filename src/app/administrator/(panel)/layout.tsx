import { Suspense } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/server/auth";

/**
 * The shell renders straight away; only the signed-in admin's name waits on
 * the session check, so navigating into the panel (e.g. after login) is
 * instant. Access is still enforced: the proxy guards every admin path,
 * `AdminName` redirects to the login page without a valid session, and
 * every page query and Server Action calls `requireAdmin()` itself.
 */
export default function PanelLayout({ children }: LayoutProps<"/administrator">) {
  return (
    <AdminShell
      adminName={
        <Suspense fallback={<span aria-hidden className="mt-1 block h-3 w-20 rounded-sm bg-tint/[0.07] motion-safe:animate-pulse" />}>
          <AdminName />
        </Suspense>
      }
    >
      {children}
    </AdminShell>
  );
}

async function AdminName() {
  const admin = await requireAdmin();
  return admin.name;
}
