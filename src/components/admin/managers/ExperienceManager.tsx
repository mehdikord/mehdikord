"use client";

import { Building2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminForm, Field, FieldGrid, TextAreaField, TextField } from "@/components/admin/form";
import { LocaleTabs } from "@/components/admin/locale";
import { Modal } from "@/components/admin/Modal";
import { Badge, CreateButton, PageHeader, ResourceTable, useEditor } from "@/components/admin/resource";
import type { ExperienceItem } from "@/components/admin/types";
import { cn } from "@/lib/utils";
import { deleteExperience, saveExperience } from "@/server/admin/actions/career";

const LOGO_ACCEPT = "image/svg+xml,image/png,image/webp,image/jpeg,image/avif,image/gif";

/** Square logo tile; a building glyph stands in when nothing is uploaded. */
function LogoTile({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cn("inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-white p-1.5", className)}>
      {src ? (
        // Plain <img>: admin thumbnails (and local previews) don't need the image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-contain" />
      ) : (
        <Building2 aria-hidden className="size-5 text-paper-muted" />
      )}
    </span>
  );
}

function LogoField({ logoUrl }: { logoUrl: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);

  // Release the local preview URL when it is replaced or the modal closes.
  useEffect(() => () => {
    if (selected) URL.revokeObjectURL(selected);
  }, [selected]);

  const shown = selected ?? (logoUrl && !remove ? logoUrl : "");

  return (
    <div className="flex items-start gap-4">
      <LogoTile src={shown} className="size-20 p-3" />
      <div className="min-w-0 flex-1 space-y-3">
        <Field label={logoUrl ? "جایگزینی لوگوی شرکت" : "لوگوی شرکت"} name="logo" hint="SVG، PNG یا WebP با زمینه شفاف، ترجیحاً مربع (حداقل ۲۵۶×۲۵۶). تا ۸ مگابایت.">
          {(field) => (
            <label
              htmlFor={field.id}
              className="flex cursor-pointer items-center gap-3 rounded-sm border border-dashed border-line-strong px-3 py-3 text-sm text-fg-muted transition-colors hover:border-accent/60 hover:text-fg"
            >
              <Upload aria-hidden className="size-4 shrink-0 text-accent" />
              <span className="truncate">{selected ? "لوگو انتخاب شد — برای ثبت، ذخیره کنید" : "انتخاب فایل…"}</span>
              <input
                {...field}
                type="file"
                name="logo"
                accept={LOGO_ACCEPT}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setSelected(file ? URL.createObjectURL(file) : null);
                  if (file) setRemove(false);
                }}
              />
            </label>
          )}
        </Field>
        {logoUrl && !selected ? (
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-muted">
            <input
              type="checkbox"
              name="removeLogo"
              checked={remove}
              onChange={(event) => setRemove(event.target.checked)}
              className="size-4 accent-[var(--color-accent)]"
            />
            حذف لوگو
          </label>
        ) : null}
      </div>
    </div>
  );
}

const period = (row: ExperienceItem) => (
  <span dir="ltr" className="font-mono text-xs text-fg-muted">
    {row.startMonth} — {row.endMonth || "now"}
  </span>
);

export function ExperienceManager({ items }: { items: ExperienceItem[] }) {
  const editor = useEditor<ExperienceItem>();
  const item = editor.item;

  return (
    <>
      <PageHeader
        title="سوابق کاری"
        description="تایم‌لاین سوابق کاری؛ به ترتیب نمایش (معمولاً جدیدترین در ابتدا)."
        action={<CreateButton label="سابقه جدید" onClick={editor.create} />}
      />
      <ResourceTable
        items={items}
        columns={[
          { header: "ترتیب", cell: (row) => row.sortOrder, className: "w-16 text-fg-subtle" },
          {
            header: "سمت",
            cell: (row) => (
              <span className="flex items-center gap-3">
                <LogoTile src={row.logoUrl} />
                <span>
                  <span className="block font-medium">{row.text.fa.position}</span>
                  <span className="block text-xs text-fg-subtle">{row.text.fa.company}</span>
                </span>
              </span>
            ),
          },
          { header: "بازه", cell: period },
          { header: "وضعیت", cell: (row) => (row.endMonth ? <Badge>پایان‌یافته</Badge> : <Badge tone="success">فعلی</Badge>) },
        ]}
        onEdit={editor.edit}
        onDelete={deleteExperience}
        describe={(row) => `${row.text.fa.position} — ${row.text.fa.company}`}
      />
      <Modal open={editor.open} onClose={editor.close} title={item ? "ویرایش سابقه کاری" : "سابقه کاری جدید"} size="lg">
        <AdminForm action={saveExperience} onSuccess={editor.close} onCancel={editor.close}>
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <LogoField logoUrl={item?.logoUrl ?? ""} />
          <FieldGrid columns={3}>
            <TextField label="شروع" name="startMonth" type="month" defaultValue={item?.startMonth} dir="ltr" className="text-start" />
            <TextField
              label="پایان"
              name="endMonth"
              type="month"
              defaultValue={item?.endMonth}
              dir="ltr"
              className="text-start"
              hint="برای موقعیت فعلی خالی بگذارید."
            />
            <TextField label="ترتیب نمایش" name="sortOrder" type="number" min={0} defaultValue={item?.sortOrder ?? items.length + 1} />
          </FieldGrid>
          <TextAreaField
            label="تکنولوژی‌ها"
            name="technologies"
            defaultValue={item?.technologies}
            rows={3}
            dir="ltr"
            className="text-start font-mono"
            hint="هر خط یک مورد."
          />
          <LocaleTabs>
            {(locale) => {
              const text = item?.text[locale];
              return (
                <>
                  <FieldGrid>
                    <TextField label="سمت" name={`${locale}.position`} defaultValue={text?.position} />
                    <TextField label="شرکت" name={`${locale}.company`} defaultValue={text?.company} />
                    <TextField label="توضیح کوتاه شرکت" name={`${locale}.companyContext`} defaultValue={text?.companyContext} hint="مثل B2B SaaS" />
                    <TextField label="محل کار" name={`${locale}.location`} defaultValue={text?.location} hint="مثل دورکاری" />
                  </FieldGrid>
                  <TextAreaField label="توضیحات" name={`${locale}.description`} defaultValue={text?.description} />
                  <TextAreaField
                    label="مسئولیت‌ها"
                    name={`${locale}.responsibilities`}
                    defaultValue={text?.responsibilities}
                    rows={5}
                    hint="هر خط یک مسئولیت."
                  />
                </>
              );
            }}
          </LocaleTabs>
        </AdminForm>
      </Modal>
    </>
  );
}
