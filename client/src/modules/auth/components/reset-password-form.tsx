"use client";

import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/constants/routes";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { resetPasswordSchema, type ResetPasswordValues } from "../schemas";
import { resetPasswordRequest } from "@/modules/auth/services/auth.service";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      toast.error("This reset link is missing a token. Request a new link.");
      return;
    }
    try {
      await resetPasswordRequest({
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      toast.success(
        "Password updated. You can sign in with your new password."
      );
      router.push(ROUTES.login);
    } catch (e: unknown) {
      const raw =
        isAxiosError(e) &&
        e.response?.data &&
        typeof e.response.data === "object"
          ? (e.response.data as { message?: unknown }).message
          : undefined;
      const msg =
        typeof raw === "string"
          ? raw
          : Array.isArray(raw)
            ? raw.filter((x): x is string => typeof x === "string").join(", ")
            : "Something went wrong";
      toast.error(msg);
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center text-sm">
        <p className="text-muted-foreground">
          This page needs a valid reset link. Open the link from your email, or
          request a new one.
        </p>
        <Link
          href={ROUTES.forgotPassword}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Request reset link
        </Link>
        <Link
          href={ROUTES.login}
          className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </Form>
  );
}
