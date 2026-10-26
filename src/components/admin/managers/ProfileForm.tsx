"use client";

import { AdminForm, CheckboxField, FieldGrid, FormSection, TextAreaField, TextField } from "@/components/admin/form";
import { LocaleTabs } from "@/components/admin/locale";
import type { ProfileItem } from "@/components/admin/types";
import { saveProfile } from "@/server/admin/actions/profile";

const ltr = { dir: "ltr" as const, className: "text-start" };

export function ProfileForm({ profile }: { profile: ProfileItem | null }) {
  return (
    <AdminForm action={saveProfile} layout="page" submitLabel="ذخیره پروفایل">
      <FormSection title="اطلاعات عمومی" description="مقادیری که بین هر دو زبان مشترک هستند.">
        <FieldGrid columns={3}>
          <TextField label="حروف اختصاری (مونوگرام)" name="initials" defaultValue={profile?.initials} maxLength={8} {...ltr} />
          <TextField
            label="سال‌های تجربه"
            name="yearsOfExperience"
            type="number"
            min={0}
            max={80}
            defaultValue={profile?.yearsOfExperience ?? 0}
            {...ltr}
          />
          <div className="flex items-end pb-2">
            <CheckboxField label="آماده همکاری هستم" name="isAvailable" defaultChecked={profile?.isAvailable ?? true} />
          </div>
        </FieldGrid>
      </FormSection>

      <FormSection title="متن‌های پروفایل" description="برای هر زبان جداگانه وارد کنید.">
        <LocaleTabs>
          {(locale) => {
            const text = profile?.text[locale];
            return (
              <>
                <FieldGrid>
                  <TextField label="نام" name={`${locale}.name`} defaultValue={text?.name} />
                  <TextField label="عنوان شغلی" name={`${locale}.title`} defaultValue={text?.title} />
                </FieldGrid>
                <FieldGrid>
                  <TextField label="موقعیت / نوع همکاری" name={`${locale}.location`} defaultValue={text?.location} />
                  <TextField label="متن وضعیت همکاری" name={`${locale}.availabilityLabel`} defaultValue={text?.availabilityLabel} />
                </FieldGrid>
                <TextAreaField
                  label="خلاصه"
                  name={`${locale}.summary`}
                  defaultValue={text?.summary}
                  hint="یک جمله برای متادیتا و فوتر سایت."
                />
                <TextAreaField
                  label="بیوگرافی (بخش درباره من)"
                  name={`${locale}.bio`}
                  defaultValue={text?.bio}
                  rows={7}
                  hint="هر خط یک پاراگراف است؛ خط اول به‌عنوان پاراگراف اصلی درشت‌تر نمایش داده می‌شود."
                />

                <h3 className="pt-2 text-sm font-semibold">بخش هیرو</h3>
                <TextAreaField
                  label="تیتر"
                  name={`${locale}.heroHeadline`}
                  defaultValue={text?.heroHeadline}
                  rows={2}
                  className="font-mono"
                  hint="هر خط یک سطر تیتر است. بخش‌های هر سطر را با | جدا کنید و بخش تأکیدی را بین دو ستاره بگذارید؛ مثال: Building | *what scales.*"
                />
                <TextAreaField label="توضیح زیر تیتر" name={`${locale}.heroDescription`} defaultValue={text?.heroDescription} />
                <FieldGrid>
                  <TextField label="متن دکمه اصلی" name={`${locale}.primaryCtaLabel`} defaultValue={text?.primaryCtaLabel} />
                  <TextField label="متن دکمه دوم" name={`${locale}.secondaryCtaLabel`} defaultValue={text?.secondaryCtaLabel} />
                </FieldGrid>
                <TextAreaField
                  label="کلیدواژه‌های امضا (پایین هیرو)"
                  name={`${locale}.signature`}
                  defaultValue={text?.signature}
                  hint="هر خط یک مورد."
                />
              </>
            );
          }}
        </LocaleTabs>
      </FormSection>

      <FormSection title="لینک‌ها و رسانه هیرو">
        <FieldGrid>
          <TextField
            label="لینک دکمه اصلی"
            name="primaryCtaHref"
            defaultValue={profile?.primaryCtaHref ?? "#work"}
            hint="مثل ‎#work برای پرش به بخش نمونه‌کارها."
            {...ltr}
          />
          <TextField label="لینک دکمه دوم" name="secondaryCtaHref" defaultValue={profile?.secondaryCtaHref ?? "#contact"} {...ltr} />
        </FieldGrid>
        <FieldGrid>
          <TextField
            label="آدرس ویدیوی پس‌زمینه"
            name="heroVideoUrl"
            type="url"
            defaultValue={profile?.heroVideoUrl}
            hint="خالی بگذارید تا فقط تصویر یا طرح پیش‌فرض نمایش داده شود."
            {...ltr}
          />
          <TextField label="آدرس تصویر پوستر" name="heroPosterUrl" type="url" defaultValue={profile?.heroPosterUrl} {...ltr} />
        </FieldGrid>
      </FormSection>

      <FormSection title="راه‌های ارتباطی" description="موارد خالی در سایت نمایش داده نمی‌شوند.">
        <FieldGrid>
          <TextField label="ایمیل" name="email" type="email" defaultValue={profile?.email} {...ltr} />
          <TextField label="تلفن" name="phone" type="tel" defaultValue={profile?.phone} hint="با پیش‌شماره بین‌المللی، مثل ‎+98 912 000 0000" {...ltr} />
          <TextField label="تلگرام" name="telegram" defaultValue={profile?.telegram} hint="نام کاربری بدون @" {...ltr} />
          <TextField label="اینستاگرام" name="instagram" defaultValue={profile?.instagram} hint="نام کاربری بدون @" {...ltr} />
          <TextField
            label="لینکدین"
            name="linkedin"
            type="url"
            defaultValue={profile?.linkedin}
            hint="آدرس کامل پروفایل"
            fieldClassName="sm:col-span-2"
            {...ltr}
          />
        </FieldGrid>
      </FormSection>
    </AdminForm>
  );
}
