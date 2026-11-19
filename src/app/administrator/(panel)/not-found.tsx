import { BackLink } from "@/components/admin/resource";

/** Shown inside the panel shell, e.g. when an edit page's record doesn't exist (anymore). */
export default function PanelNotFound() {
  return (
    <div className="rounded-lg border border-dashed border-line-strong px-6 py-14 text-center">
      <h1 className="text-lg font-semibold">این مورد پیدا نشد</h1>
      <p className="mt-2 mb-6 text-sm text-fg-subtle">ممکن است حذف شده باشد یا آدرس آن اشتباه باشد.</p>
      <BackLink href="/administrator" label="بازگشت به داشبورد" />
    </div>
  );
}
