import type { Metadata } from "next";

import { ProfileForm } from "@/components/admin/managers/ProfileForm";
import { PageHeader } from "@/components/admin/resource";
import { getProfileItem } from "@/server/admin/queries";

export const metadata: Metadata = { title: "پروفایل و صفحه اصلی" };

export default async function ProfilePage() {
  const profile = await getProfileItem();
  return (
    <>
      <PageHeader
        title="پروفایل و صفحه اصلی"
        description="نام، معرفی، بخش هیرو، وضعیت همکاری و راه‌های ارتباطی که در سراسر سایت نمایش داده می‌شوند."
      />
      <ProfileForm profile={profile} />
    </>
  );
}
