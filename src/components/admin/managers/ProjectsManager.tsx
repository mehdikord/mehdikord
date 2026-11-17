"use client";

import { ImageIcon, Loader2, Star, Upload } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import {
  AdminForm,
  buttonClass,
  CheckboxField,
  Field,
  FieldGrid,
  FormSection,
  SelectField,
  TextAreaField,
  TextField,
  useFormPending,
} from "@/components/admin/form";
import { LocaleTabs, NotesField } from "@/components/admin/locale";
import { Modal } from "@/components/admin/Modal";
import { Badge, CreateButton, DeleteButton, PageHeader, ResourceTable, useEditor } from "@/components/admin/resource";
import { useToast } from "@/components/admin/Toast";
import type { Option, ProjectImageItem, ProjectItem } from "@/components/admin/types";
import { projectPlaceholder } from "@/data/media";
import { localizeDigits } from "@/i18n/format";
import { cn } from "@/lib/utils";
import { deleteProject, deleteProjectImage, saveProject, setProjectCover, uploadProjectImage } from "@/server/admin/actions/projects";

const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif";
/** Mirrors MAX_SCREENSHOT_BYTES on the server. */
const MAX_UPLOAD_MB = 40;
const UPLOAD_HINT = `PNG، JPG، WebP یا AVIF تا ${localizeDigits("fa", MAX_UPLOAD_MB)} مگابایت. اسکرین‌شات کامل صفحه (Full page) با عرض ۱۹۲۰ پیکسل بهترین نتیجه را می‌دهد؛ تصویر روی سرور با کیفیت بالا به WebP تبدیل و بهینه می‌شود.`;

/** "30.2 مگابایت" / "820 کیلوبایت" */
function formatBytes(bytes: number): string {
  const megabytes = bytes / (1024 * 1024);
  return megabytes >= 1
    ? `${localizeDigits("fa", megabytes.toFixed(1))} مگابایت`
    : `${localizeDigits("fa", Math.max(1, Math.round(bytes / 1024)))} کیلوبایت`;
}

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
              return <Thumbnail src={cover?.thumb ?? projectPlaceholder.src} alt="" className={cover ? undefined : "opacity-60"} />;
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
        description="اسکرین‌شات کامل صفحه سایت. در کارت‌ها فقط بالای صفحه نمایش داده می‌شود و در صفحه پروژه کل صفحه داخل قاب مانیتور اسکرول می‌شود. بدون تصویر، تصویر پیش‌فرض نمایش داده می‌شود."
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

interface PickedFile {
  url: string;
  name: string;
  bytes: number;
  width: number;
  height: number;
}

/**
 * File input for a page screenshot: rejects oversized files before the
 * upload starts, shows what was picked, and explains the wait while the
 * server converts it.
 */
function ScreenshotInput({ name, label, hint, onPick }: { name: string; label: string; hint: string; onPick?: (file: PickedFile | null) => void }) {
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pending = useFormPending();

  // Release the local preview URL when it is replaced or the form closes.
  useEffect(() => () => {
    if (picked) URL.revokeObjectURL(picked.url);
  }, [picked]);

  function choose(input: HTMLInputElement) {
    const file = input.files?.[0];
    setError(null);
    const reset = () => {
      setPicked(null);
      onPick?.(null);
    };
    if (!file) return reset();
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      input.value = "";
      setError(`حجم این فایل ${formatBytes(file.size)} است؛ حداکثر ${localizeDigits("fa", MAX_UPLOAD_MB)} مگابایت مجاز است.`);
      return reset();
    }
    const url = URL.createObjectURL(file);
    const probe = new window.Image();
    probe.onload = () => {
      const next = { url, name: file.name, bytes: file.size, width: probe.naturalWidth, height: probe.naturalHeight };
      setPicked(next);
      onPick?.(next);
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      input.value = "";
      setError("این فایل تصویر قابل خواندن نیست.");
      reset();
    };
    probe.src = url;
  }

  return (
    <Field label={label} name={name} hint={hint}>
      {(field) => (
        <div className="space-y-2">
          <label
            htmlFor={field.id}
            className="flex cursor-pointer items-center gap-3 rounded-sm border border-dashed border-line-strong px-3 py-3 text-sm text-fg-muted transition-colors hover:border-accent/60 hover:text-fg"
          >
            <Upload aria-hidden className="size-4 shrink-0 text-accent" />
            <span className="min-w-0 flex-1 truncate">{picked ? picked.name : "انتخاب فایل…"}</span>
            <input
              {...field}
              type="file"
              name={name}
              accept={IMAGE_ACCEPT}
              className="sr-only"
              onChange={(event) => choose(event.currentTarget)}
            />
          </label>
          {picked ? (
            <p className="text-xs text-fg-subtle">
              <span dir="ltr">
                {localizeDigits("fa", picked.width)}×{localizeDigits("fa", picked.height)}
              </span>{" "}
              پیکسل · {formatBytes(picked.bytes)} — پس از ذخیره به WebP بهینه تبدیل می‌شود.
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="text-xs text-red-300">
              {error}
            </p>
          ) : null}
          {pending && picked ? (
            <p role="status" className="flex items-center gap-2 text-xs text-accent">
              <Loader2 aria-hidden className="size-3.5 animate-spin" />
              در حال بارگذاری و بهینه‌سازی تصویر… ممکن است چند ثانیه طول بکشد.
            </p>
          ) : null}
        </div>
      )}
    </Field>
  );
}

function CoverField({ cover }: { cover?: ProjectImageItem }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);

  const shown = selected ?? (cover && !remove ? cover.thumb : projectPlaceholder.src);
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
        <ScreenshotInput
          name="cover"
          label={cover ? "جایگزینی تصویر" : "بارگذاری تصویر"}
          hint={UPLOAD_HINT}
          onPick={(file) => {
            setSelected(file?.url ?? null);
            if (file) setRemove(false);
          }}
        />
        {cover && !selected ? (
          <>
            <p className="text-xs text-fg-subtle">
              تصویر فعلی:{" "}
              <span dir="ltr">
                {localizeDigits("fa", cover.width)}×{localizeDigits("fa", cover.height)}
              </span>
              {cover.bytes ? ` · ${formatBytes(cover.bytes)} WebP` : null}
            </p>
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
          </>
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
              <Thumbnail src={image.thumb} alt={image.alt} className="rounded-none border-0" />
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="min-w-0 truncate text-xs text-fg-subtle">
                  <span dir="ltr">
                    {image.width}×{image.height}
                  </span>
                  {image.bytes ? ` · ${formatBytes(image.bytes)}` : null}
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
            <ScreenshotInput label="فایل تصویر" name="file" hint={UPLOAD_HINT} />
            <TextField label="متن جایگزین (alt)" name="alt" hint="خالی بماند، عنوان پروژه استفاده می‌شود." />
          </FieldGrid>
          <CheckboxField label="به‌عنوان تصویر کاور تنظیم شود" name="isCover" hint="اولین تصویر هر پروژه خودکار کاور می‌شود. بقیه تصاویر در گالری صفحه پروژه نمایش داده می‌شوند." />
        </AdminForm>
      </div>
    </div>
  );
}
