"use client";

import { AdminForm, FieldGrid, TextAreaField, TextField } from "@/components/admin/form";
import { LocaleTabs } from "@/components/admin/locale";
import { Modal } from "@/components/admin/Modal";
import { Badge, CreateButton, PageHeader, ResourceTable, useEditor } from "@/components/admin/resource";
import type { SkillGroupItem } from "@/components/admin/types";
import { localizeDigits } from "@/i18n/format";
import { deleteSkillGroup, saveSkillGroup } from "@/server/admin/actions/career";

export function SkillGroupsManager({ items }: { items: SkillGroupItem[] }) {
  const editor = useEditor<SkillGroupItem>();
  const item = editor.item;

  return (
    <>
      <PageHeader
        title="مهارت‌ها"
        description="گروه‌های مهارت فنی در بخش تخصص‌ها."
        action={<CreateButton label="گروه جدید" onClick={editor.create} />}
      />
      <ResourceTable
        items={items}
        columns={[
          { header: "ترتیب", cell: (row) => row.sortOrder, className: "w-16 text-fg-subtle" },
          { header: "عنوان", cell: (row) => <span className="font-medium">{row.text.fa.title}</span> },
          { header: "English", cell: (row) => <span dir="ltr" className="text-fg-muted">{row.text.en.title}</span> },
          { header: "تعداد مهارت", cell: (row) => <Badge>{localizeDigits("fa", row.text.fa.items.length)}</Badge> },
        ]}
        onEdit={editor.edit}
        onDelete={deleteSkillGroup}
        describe={(row) => row.text.fa.title || row.text.en.title}
      />
      <Modal open={editor.open} onClose={editor.close} title={item ? "ویرایش گروه مهارت" : "گروه مهارت جدید"}>
        <AdminForm action={saveSkillGroup} onSuccess={editor.close} onCancel={editor.close}>
          {item ? <input type="hidden" name="id" value={item.id} /> : null}
          <TextField label="ترتیب نمایش" name="sortOrder" type="number" min={0} defaultValue={item?.sortOrder ?? items.length + 1} fieldClassName="max-w-40" />
          <LocaleTabs>
            {(locale) => (
              <>
                <FieldGrid>
                  <TextField label="عنوان" name={`${locale}.title`} defaultValue={item?.text[locale].title} />
                  <TextField label="برچسب کوتاه" name={`${locale}.annotation`} defaultValue={item?.text[locale].annotation} />
                </FieldGrid>
                <TextAreaField label="مهارت‌ها" name={`${locale}.items`} defaultValue={item?.text[locale].items} rows={7} hint="هر خط یک مهارت." />
              </>
            )}
          </LocaleTabs>
        </AdminForm>
      </Modal>
    </>
  );
}
