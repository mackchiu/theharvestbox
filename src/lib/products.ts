import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  subscription_price: number;
  one_time_price: number;
  image_url: string | null;
  serves: string | null;
  available: boolean;
  stripe_subscription_price_id: string | null;
  stripe_one_time_price_id: string | null;
  created_at: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("subscription_price", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data || [];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching product:", error);
    throw error;
  }

  return data;
}
