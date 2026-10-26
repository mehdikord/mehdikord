"use client";

import { AdminForm, FieldGrid, TextAreaField, TextField } from "@/components/admin/form";
import { LocaleTabs } from "@/components/admin/locale";
import { Modal } from "@/components/admin/Modal";
import { Badge, CreateButton, PageHeader, ResourceTable, useEditor } from "@/components/admin/resource";
import type { ExperienceItem } from "@/components/admin/types";
import { deleteExperience, saveExperience } from "@/server/admin/actions/career";

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
              <span>
                <span className="block font-medium">{row.text.fa.position}</span>
                <span className="block text-xs text-fg-subtle">{row.text.fa.company}</span>
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
