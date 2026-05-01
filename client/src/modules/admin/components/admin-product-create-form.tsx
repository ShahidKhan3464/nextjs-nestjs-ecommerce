"use client";

import { z } from "zod";
import { toast } from "sonner";
import type { Product } from "@/types";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { createAdminProduct } from "@/modules/admin/services/admin.service";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const img = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1000`;

const schema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case"),
  description: z.string().min(10),
  category: z.string().min(2),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
});

type Values = z.infer<typeof schema>;

export function AdminProductCreateForm() {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(schema) as Resolver<Values>,
    defaultValues: {
      name: "",
      slug: "",
      price: 99,
      stock: 20,
      description: "",
      category: "Apparel",
    },
  });

  async function onSubmit(values: Values) {
    const id = `p${crypto.randomUUID().slice(0, 8)}`;
    const product: Product = {
      id,
      slug: values.slug,
      name: values.name,
      description: values.description,
      category: values.category,
      rating: 0,
      reviewCount: 0,
      images: [img(values.slug), img(`${values.slug}-2`)],
      featured: false,
      variants: [
        {
          id: `${id}-v1`,
          productId: id,
          sku: `${values.slug.toUpperCase()}-DEF`,
          name: "Default",
          options: { type: "Default" },
          price: values.price,
          compareAtPrice: values.price + 20,
          stock: values.stock,
          image: img(`${values.slug}-v`),
        },
      ],
    };

    try {
      await createAdminProduct(product);
      toast.success("Product created");
      router.push(ROUTES.products);
      router.refresh();
    } catch {
      toast.error("Could not create product");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="slug"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="my-product" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="stock"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial stock</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating…" : "Create product"}
        </Button>
      </form>
    </Form>
  );
}
