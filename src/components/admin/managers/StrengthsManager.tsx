"use client";

import { AdminForm, FieldGrid, SelectField, TextField } from "@/components/admin/form";
import { LocaleTabs } from "@/components/admin/locale";
import { Modal } from "@/components/admin/Modal";
import { CreateButton, PageHeader, ResourceTable, useEditor } from "@/components/admin/resource";
import type { StrengthItem } from "@/components/admin/types";
import { strengthIcons } from "@/data/options";
import { deleteStrength, saveStrength } from "@/server/admin/actions/about";

const iconLabels: Record<(typeof strengthIcons)[number], string> = {
  code: "کد",
  architecture: "معماری",
  api: "API",
  database: "پایگاه‌داده",
  modules: "ماژول‌ها",
  scale: "مقیاس‌پذیری",
  auth: "احراز هویت",
  security: "امنیت",
  integrations: "یکپارچه‌سازی",
  performance: "کارایی",
  leadership: "رهبری",
  frontend: "فرانت‌اند",
  ai: "هوش مصنوعی",
};

const iconOptions = strengthIcons.map((icon) => ({ value: icon, label: `${iconLabels[icon]} (${icon})` }));

export function StrengthsManager({ items }: { items: StrengthItem[] }) {
  const editor = useEditor<StrengthItem>();
  const item = editor.item;

  return (
    <>
      <PageHeader
        title="توانمندی‌های کلیدی"
        description="فهرست توانمندی‌ها با آیکون در بخش «درباره من»."
        action={<CreateButton label="توانمندی جدید" onClick={editor.create} />}
      />
      <ResourceTable
        items={items}
        columns={[
          { header: "ترتیب", cell: (row) => row.sortOrder, className: "w-16 text-fg-subtle" },
          { header: "عنوان", cell: (row) => <span className="font-medium">{row.text.fa.label}</span> },
          { header: "English", cell: (row) => <span dir="ltr" className="text-fg-muted">{row.text.en.label}</span> },
          { header: "آیکون", cell: (row) => <span className="font-mono text-xs text-fg-subtle">{row.icon}</span> },
        ]}
        onEdit={editor.edit}
        onDelete={deleteStrength}
        describe={(row) => row.text.fa.label || row.text.en.label}
      />
      <Modal open={editor.open} onClose={editor.close} title={item ? "ویرایش توانمندی" : "توانمندی جدید"} size="sm">
        <AdminForm action={saveStrength} onSuccess={editor.close} onCancel={editor.close}>
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <FieldGrid>
            <SelectField label="آیکون" name="icon" options={iconOptions} defaultValue={item?.icon ?? strengthIcons[0]} />
            <TextField label="ترتیب نمایش" name="sortOrder" type="number" min={0} defaultValue={item?.sortOrder ?? items.length + 1} />
          </FieldGrid>
          <LocaleTabs>{(locale) => <TextField label="عنوان" name={`${locale}.label`} defaultValue={item?.text[locale].label} />}</LocaleTabs>
        </AdminForm>
      </Modal>
    </>
  );
}
