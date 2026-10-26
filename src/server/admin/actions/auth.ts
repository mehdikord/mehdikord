"use server";

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionState } from "@/server/admin/action-state";
import { fail, parseForm } from "@/server/admin/forms";
import { LOGIN_PATH } from "@/server/auth";
import { db } from "@/server/db";
import { SESSION_COOKIE, SESSION_PATH, sessionCookieOptions, signSession } from "@/server/session";

/** Persian and Arabic-Indic digits → ASCII, without spaces or dashes. */
const normalizePhone = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\s-]/g, "");

const loginSchema = z.object({
  phone: z
    .string()
    .transform(normalizePhone)
    .pipe(z.string().regex(/^09\d{9}$/, "شماره موبایل را به شکل ۰۹xxxxxxxxx وارد کنید.")),
  password: z.string().min(1, "رمز عبور را وارد کنید.").max(255),
});

// Compared against when the phone is unknown, so both paths cost the same.
const DUMMY_HASH = "$2b$12$v2EJ.8vRIQ17W867BHXDYepXB9V0oEXSkJny7QoEbOdYHkArjIOqS";

export async function login(_state: ActionState, formData: FormData): Promise<ActionState> {
  const { data, failure } = parseForm(loginSchema, formData);
  if (failure) return { ...failure, message: undefined };

  const user = await db.user.findUnique({ where: { phone: data.phone } });
  const valid = await compare(data.password, user?.password ?? DUMMY_HASH);
  if (!user || !valid) return fail("شماره موبایل یا رمز عبور اشتباه است.");

  const { token, expires } = await signSession(user.id);
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  redirect(SESSION_PATH);
}

export async function logout(): Promise<void> {
  (await cookies()).delete({ name: SESSION_COOKIE, path: SESSION_PATH });
  redirect(LOGIN_PATH);
}
