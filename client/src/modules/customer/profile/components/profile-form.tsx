"use client";

import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { updateProfile } from "../services/profile.service";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  avatarUrl: z
    .string()
    .optional()
    .transform((v) => v?.trim() || undefined)
    .refine(
      (v) => v === undefined || v === "" || /^https?:\/\//.test(v),
      "Enter a valid URL"
    ),
});

type Values = z.infer<typeof schema>;

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const form = useForm<Values>({
    resolver: zodResolver(schema) as Resolver<Values>,
    defaultValues: {
      name: user?.name ?? "",
      avatarUrl: user?.avatarUrl ?? "",
    },
  });

  async function onSubmit(values: Values) {
    try {
      const next = await updateProfile({
        name: values.name,
        avatarUrl: values.avatarUrl,
      });
      setUser(next);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-medium">Email</p>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
        <p className="text-muted-foreground text-xs">
          Changing email would require verification in production.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="avatarUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
