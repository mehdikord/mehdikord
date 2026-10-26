"use client";

import { AdminForm, TextAreaField, TextField } from "@/components/admin/form";
import { LocaleTabs } from "@/components/admin/locale";
import { Modal } from "@/components/admin/Modal";
import { CreateButton, PageHeader, ResourceTable, useEditor } from "@/components/admin/resource";
import type { PrincipleItem } from "@/components/admin/types";
import { deletePrinciple, savePrinciple } from "@/server/admin/actions/about";

export function PrinciplesManager({ items }: { items: PrincipleItem[] }) {
  const editor = useEditor<PrincipleItem>();
  const item = editor.item;

  return (
    <>
      <PageHeader
        title="اصول مهندسی"
        description="اصولی که در بخش «درباره من» زیر عنوان فلسفه مهندسی نمایش داده می‌شوند."
        action={<CreateButton label="اصل جدید" onClick={editor.create} />}
      />
      <ResourceTable
        items={items}
        columns={[
          { header: "ترتیب", cell: (row) => row.sortOrder, className: "w-16 text-fg-subtle" },
          { header: "عنوان", cell: (row) => <span className="font-medium">{row.text.fa.title}</span> },
          { header: "English", cell: (row) => <span dir="ltr" className="text-fg-muted">{row.text.en.title}</span> },
        ]}
        onEdit={editor.edit}
        onDelete={deletePrinciple}
        describe={(row) => row.text.fa.title || row.text.en.title}
      />
      <Modal open={editor.open} onClose={editor.close} title={item ? "ویرایش اصل" : "اصل جدید"}>
        <AdminForm action={savePrinciple} onSuccess={editor.close} onCancel={editor.close}>
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextField label="ترتیب نمایش" name="sortOrder" type="number" min={0} defaultValue={item?.sortOrder ?? items.length + 1} fieldClassName="max-w-40" />
          <LocaleTabs>
            {(locale) => (
              <>
                <TextField label="عنوان" name={`${locale}.title`} defaultValue={item?.text[locale].title} />
                <TextAreaField label="توضیح" name={`${locale}.body`} defaultValue={item?.text[locale].body} rows={4} />
              </>
            )}
          </LocaleTabs>
        </AdminForm>
      </Modal>
    </>
  );
}
