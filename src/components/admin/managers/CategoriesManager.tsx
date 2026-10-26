"use client";

import { AdminForm, FieldGrid, TextField } from "@/components/admin/form";
import { LocaleTabs } from "@/components/admin/locale";
import { Modal } from "@/components/admin/Modal";
import { Badge, CreateButton, PageHeader, ResourceTable, useEditor } from "@/components/admin/resource";
import type { CategoryItem } from "@/components/admin/types";
import { localizeDigits } from "@/i18n/format";
import { deleteCategory, saveCategory } from "@/server/admin/actions/projects";

export function CategoriesManager({ items }: { items: CategoryItem[] }) {
  const editor = useEditor<CategoryItem>();
  const item = editor.item;

  return (
    <>
      <PageHeader
        title="دسته‌بندی پروژه‌ها"
        description="حوزه‌هایی که پروژه‌ها در صفحه پروژه‌ها بر اساس آن‌ها فیلتر می‌شوند. دسته‌بندی دارای پروژه قابل حذف نیست."
        action={<CreateButton label="دسته‌بندی جدید" onClick={editor.create} />}
      />
      <ResourceTable
        items={items}
        columns={[
          { header: "ترتیب", cell: (row) => row.sortOrder, className: "w-16 text-fg-subtle" },
          { header: "عنوان", cell: (row) => <span className="font-medium">{row.text.fa.label}</span> },
          { header: "English", cell: (row) => <span dir="ltr" className="text-fg-muted">{row.text.en.label}</span> },
          { header: "شناسه", cell: (row) => <span className="font-mono text-xs text-fg-subtle">{row.slug}</span> },
          { header: "پروژه‌ها", cell: (row) => <Badge>{localizeDigits("fa", row.projectCount)}</Badge> },
        ]}
        onEdit={editor.edit}
        onDelete={deleteCategory}
        describe={(row) => row.text.fa.label || row.slug}
      />
      <Modal open={editor.open} onClose={editor.close} title={item ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"} size="sm">
        <AdminForm action={saveCategory} onSuccess={editor.close} onCancel={editor.close}>
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <FieldGrid>
            <TextField
              label="شناسه (انگلیسی)"
              name="slug"
              defaultValue={item?.slug}
              dir="ltr"
              className="text-start font-mono"
              hint="در آدرس فیلتر استفاده می‌شود."
            />
            <TextField label="ترتیب نمایش" name="sortOrder" type="number" min={0} defaultValue={item?.sortOrder ?? items.length + 1} />
          </FieldGrid>
          <LocaleTabs>{(locale) => <TextField label="عنوان" name={`${locale}.label`} defaultValue={item?.text[locale].label} />}</LocaleTabs>
        </AdminForm>
      </Modal>
    </>
  );
}
