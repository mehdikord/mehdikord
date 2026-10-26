"use client";

import { ImageIcon, Star, Upload } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { AdminForm, buttonClass, CheckboxField, Field, FieldGrid, FormSection, SelectField, TextAreaField, TextField } from "@/components/admin/form";
import { LocaleTabs, NotesField } from "@/components/admin/locale";
import { Modal } from "@/components/admin/Modal";
import { Badge, CreateButton, DeleteButton, PageHeader, ResourceTable, useEditor } from "@/components/admin/resource";
import { useToast } from "@/components/admin/Toast";
import type { Option, ProjectImageItem, ProjectItem } from "@/components/admin/types";
import { projectPlaceholder } from "@/data/media";
import { localizeDigits } from "@/i18n/format";
import { cn } from "@/lib/utils";
import { deleteProject, deleteProjectImage, saveProject, setProjectCover, uploadProjectImage } from "@/server/admin/actions/projects";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif";

const coverOf = (project: ProjectItem): ProjectImageItem | undefined => project.images.find((image) => image.isCover);

/** 16:10 thumbnail, cropped from the top like the site's project frames. */
function Thumbnail({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // Plain <img>: admin thumbnails (and local previews) don't need the image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={cn("aspect-[16/10] w-full rounded-sm border border-line bg-ink-950 object-cover object-top", className)} />
  );
}
const ltrMono = { dir: "ltr" as const, className: "text-start font-mono" };

export function ProjectsManager({ items, categories }: { items: ProjectItem[]; categories: Option[] }) {
  const editor = useEditor<ProjectItem>();
  const gallery = useEditor<ProjectItem>();
  const categoryLabels = new Map(categories.map((category) => [category.value, category.label]));
  // Re-read from the latest props so the images modal reflects uploads immediately.
  const galleryProject = gallery.item ? items.find((project) => project.id === gallery.item?.id) : undefined;

  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        description="نمونه‌کارها، مطالعه موردی و تصاویر هر پروژه. پروژه‌های ویژه در صفحه اصلی نمایش داده می‌شوند."
        action={<CreateButton label="پروژه جدید" onClick={editor.create} />}
      />
      {categories.length === 0 ? (
        <p className="mb-4 rounded-sm border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          برای افزودن پروژه، ابتدا یک دسته‌بندی بسازید.
        </p>
      ) : null}
      <ResourceTable
        items={items}
        columns={[
          { header: "ترتیب", cell: (row) => row.sortOrder, className: "w-16 text-fg-subtle" },
          {
            header: "تصویر",
            className: "w-28",
            cell: (row) => {
              const cover = coverOf(row);
              return <Thumbnail src={cover?.path ?? projectPlaceholder.src} alt="" className={cover ? undefined : "opacity-60"} />;
            },
          },
          {
            header: "پروژه",
            cell: (row) => (
              <span>
                <span className="block font-medium">{row.text.fa.title || row.text.en.title}</span>
                <span dir="ltr" className="block font-mono text-xs text-fg-subtle">
                  /{row.slug}
                </span>
              </span>
            ),
          },
          { header: "دسته‌بندی", cell: (row) => <span className="text-fg-muted">{categoryLabels.get(row.projectCategoryId)}</span> },
          { header: "دوره", cell: (row) => <span dir="ltr" className="text-xs text-fg-muted">{row.period}</span> },
          {
            header: "وضعیت",
            cell: (row) => (
              <span className="flex flex-wrap gap-1">
                {row.isFeatured ? <Badge tone="accent">ویژه</Badge> : null}
                {row.caseStudyAvailable ? <Badge tone="success">مطالعه موردی</Badge> : null}
                <Badge>{localizeDigits("fa", row.images.length)} تصویر</Badge>
              </span>
            ),
          },
        ]}
        extraActions={(row) => (
          <button type="button" onClick={() => gallery.edit(row)} className={buttonClass("ghost", "sm")}>
            <ImageIcon aria-hidden className="size-3.5" />
            گالری
          </button>
        )}
        onEdit={editor.edit}
        onDelete={deleteProject}
        describe={(row) => row.text.fa.title || row.slug}
      />

      <Modal open={editor.open} onClose={editor.close} title={editor.item ? "ویرایش پروژه" : "پروژه جدید"} size="lg">
        <ProjectForm item={editor.item} categories={categories} nextOrder={items.length + 1} onDone={editor.close} />
      </Modal>

      <Modal
        open={gallery.open && Boolean(galleryProject)}
        onClose={gallery.close}
        title="تصاویر و گالری پروژه"
        description={galleryProject ? galleryProject.text.fa.title || galleryProject.slug : undefined}
        size="lg"
      >
        {galleryProject ? <ProjectImages project={galleryProject} /> : null}
      </Modal>
    </>
  );
}

function ProjectForm({ item, categories, nextOrder, onDone }: { item: ProjectItem | null; categories: Option[]; nextOrder: number; onDone: () => void }) {
  return (
    <AdminForm action={saveProject} onSuccess={onDone} onCancel={onDone}>
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <FormSection title="مشخصات">
        <FieldGrid columns={3}>
          <SelectField
            label="دسته‌بندی"
            name="projectCategoryId"
            options={categories}
            placeholder="انتخاب کنید"
            defaultValue={item?.projectCategoryId ?? ""}
          />
          <TextField label="شناسه آدرس (slug)" name="slug" defaultValue={item?.slug} hint="مثل atlas-crm" {...ltrMono} />
          <TextField label="دوره زمانی" name="period" defaultValue={item?.period} hint="مثل ‎2024 — 2025" dir="ltr" className="text-start" />
        </FieldGrid>
        <FieldGrid>
          <TextField
            label="آدرس نسخه آنلاین"
            name="liveUrl"
            type="url"
            defaultValue={item?.liveUrl}
            hint="اگر عمومی نیست خالی بگذارید."
            dir="ltr"
            className="text-start"
          />
          <TextField label="ترتیب نمایش" name="sortOrder" type="number" min={0} defaultValue={item?.sortOrder ?? nextOrder} />
        </FieldGrid>
        <TextAreaField label="تکنولوژی‌ها" name="technologies" defaultValue={item?.technologies} rows={3} hint="هر خط یک مورد." {...ltrMono} />
        <div className="grid gap-3 sm:grid-cols-2">
          <CheckboxField label="پروژه ویژه" name="isFeatured" defaultChecked={item?.isFeatured} hint="در بخش نمونه‌کارهای صفحه اصلی نمایش داده می‌شود (ترجیحاً سه پروژه)." />
          <CheckboxField
            label="نمایش مطالعه موردی"
            name="caseStudyAvailable"
            defaultChecked={item?.caseStudyAvailable}
            hint="وقتی زمینه و حداقل یک چالش یا تصمیم پر شده باشد."
          />
        </div>
      </FormSection>

      <FormSection
        title="تصویر پروژه"
        description="اسکرین‌شات سایت یا محصول؛ در کارت‌ها و صفحه پروژه با همین کادر و از بالای تصویر نمایش داده می‌شود. بدون تصویر، تصویر پیش‌فرض نمایش داده می‌شود."
      >
        <CoverField cover={item ? coverOf(item) : undefined} />
      </FormSection>

      <FormSection title="محتوا">
        <LocaleTabs>
          {(locale) => {
            const text = item?.text[locale];
            return (
              <>
                <FieldGrid>
                  <TextField label="عنوان" name={`${locale}.title`} defaultValue={text?.title} />
                  <TextField label="نقش من" name={`${locale}.role`} defaultValue={text?.role} />
                </FieldGrid>
                <TextAreaField label="توضیح کوتاه" name={`${locale}.shortDescription`} defaultValue={text?.shortDescription} rows={2} />
                <TextAreaField
                  label="توضیح کامل"
                  name={`${locale}.fullDescription`}
                  defaultValue={text?.fullDescription}
                  rows={5}
                  hint="هر خط یک پاراگراف."
                />
                <FieldGrid>
                  <TextAreaField label="نکات برجسته" name={`${locale}.highlights`} defaultValue={text?.highlights} rows={4} hint="هر خط یک مورد." />
                  <TextAreaField
                    label="مسئولیت‌ها"
                    name={`${locale}.responsibilities`}
                    defaultValue={text?.responsibilities}
                    rows={4}
                    hint="هر خط یک مورد."
                  />
                </FieldGrid>

                <div className="space-y-4 rounded-sm border border-line bg-ink-950/30 p-4">
                  <h3 className="text-sm font-semibold">مطالعه موردی</h3>
                  <TextAreaField label="زمینه و صورت مسئله" name={`${locale}.caseStudyContext`} defaultValue={text?.caseStudyContext} rows={3} />
                  <NotesField label="چالش‌ها" name={`${locale}.caseStudyChallenges`} defaultValue={text?.caseStudyChallenges} />
                  <NotesField label="تصمیم‌های کلیدی" name={`${locale}.caseStudyDecisions`} defaultValue={text?.caseStudyDecisions} />
                  <TextAreaField
                    label="جزئیات پیاده‌سازی"
                    name={`${locale}.caseStudyImplementation`}
                    defaultValue={text?.caseStudyImplementation}
                    rows={4}
                    hint="هر خط یک مورد."
                  />
                </div>
              </>
            );
          }}
        </LocaleTabs>
      </FormSection>
    </AdminForm>
  );
}

function CoverField({ cover }: { cover?: ProjectImageItem }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);

  // Release the local preview URL when it is replaced or the modal closes.
  useEffect(() => () => {
    if (selected) URL.revokeObjectURL(selected);
  }, [selected]);

  const shown = selected ?? (cover && !remove ? cover.path : projectPlaceholder.src);
  const isDefault = !selected && (!cover || remove);

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,18rem)_1fr] sm:items-start">
      <div className="relative">
        <Thumbnail src={shown} alt="پیش‌نمایش تصویر پروژه" />
        <span className="absolute start-2 top-2 rounded-full bg-ink-950/80 px-2 py-0.5 text-[0.6875rem] text-fg-muted backdrop-blur">
          {selected ? "تصویر جدید" : isDefault ? "تصویر پیش‌فرض" : "تصویر فعلی"}
        </span>
      </div>
      <div className="space-y-3">
        <Field
          label={cover ? "جایگزینی تصویر" : "بارگذاری تصویر"}
          name="cover"
          hint="JPG، PNG، WebP، AVIF یا GIF تا ۸ مگابایت. اندازه پیشنهادی ۱۶۰۰×۱۰۰۰ پیکسل (نسبت ۱۶:۱۰)."
        >
          {(field) => (
            <label
              htmlFor={field.id}
              className="flex cursor-pointer items-center gap-3 rounded-sm border border-dashed border-line-strong px-3 py-3 text-sm text-fg-muted transition-colors hover:border-accent/60 hover:text-fg"
            >
              <Upload aria-hidden className="size-4 shrink-0 text-accent" />
              <span className="truncate">{selected ? "تصویر انتخاب شد — برای ثبت، ذخیره کنید" : "انتخاب فایل…"}</span>
              <input
                {...field}
                type="file"
                name="cover"
                accept={IMAGE_ACCEPT}
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
        {cover && !selected ? (
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg-muted">
            <input
              type="checkbox"
              name="removeCover"
              checked={remove}
              onChange={(event) => setRemove(event.target.checked)}
              className="size-4 accent-[var(--color-accent)]"
            />
            حذف تصویر و نمایش تصویر پیش‌فرض
          </label>
        ) : null}
        <p className="text-xs text-fg-subtle">برای افزودن تصاویر بیشتر به گالری صفحه پروژه، از دکمه «گالری» در جدول استفاده کنید.</p>
      </div>
    </div>
  );
}

function ProjectImages({ project }: { project: ProjectItem }) {
  const [pending, startTransition] = useTransition();
  const notify = useToast();

  const makeCover = (id: string) =>
    startTransition(async () => {
      const result = await setProjectCover(id);
      if (result.message) notify(result.message, result.ok ? "success" : "error");
    });

  return (
    <div>
      {project.images.length === 0 ? (
        <p className="mx-5 mt-5 rounded-sm border border-dashed border-line-strong px-4 py-8 text-center text-sm text-fg-subtle sm:mx-6">
          هنوز تصویری بارگذاری نشده است؛ در سایت تصویر پیش‌فرض نمایش داده می‌شود.
        </p>
      ) : (
        <ul className="grid gap-3 px-5 pt-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {project.images.map((image) => (
            <li key={image.id} className={cn("overflow-hidden rounded-md border bg-ink-950", image.isCover ? "border-accent/60" : "border-line")}>
              <Thumbnail src={image.path} alt={image.alt} className="rounded-none border-0" />
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="min-w-0 truncate text-xs text-fg-subtle" dir="ltr">
                  {image.width}×{image.height}
                </span>
                <span className="flex items-center gap-1">
                  {image.isCover ? (
                    <Badge tone="accent">کاور</Badge>
                  ) : (
                    <button type="button" disabled={pending} onClick={() => makeCover(image.id)} className={buttonClass("ghost", "sm")}>
                      <Star aria-hidden className="size-3.5" />
                      کاور
                    </button>
                  )}
                  <DeleteButton compact name="این تصویر" onConfirm={() => deleteProjectImage(image.id)} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 border-t border-line">
        <AdminForm action={uploadProjectImage} submitLabel="بارگذاری تصویر" key={project.images.length}>
          <input type="hidden" name="projectId" value={project.id} />
          <FieldGrid>
            <TextField label="فایل تصویر" name="file" type="file" accept={IMAGE_ACCEPT} hint="JPG، PNG، WebP، AVIF یا GIF تا ۸ مگابایت." />
            <TextField label="متن جایگزین (alt)" name="alt" hint="خالی بماند، عنوان پروژه استفاده می‌شود." />
          </FieldGrid>
          <CheckboxField label="به‌عنوان تصویر کاور تنظیم شود" name="isCover" hint="اولین تصویر هر پروژه خودکار کاور می‌شود. بقیه تصاویر در گالری صفحه پروژه نمایش داده می‌شوند." />
        </AdminForm>
      </div>
    </div>
  );
}
