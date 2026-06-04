import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { useWishlistStore } from "@/store/wishlist-store";
import { isAuthenticatedForCartWishlist } from "@/lib/cart-wishlist-session";
import { toggleWishlistItem } from "@/modules/customer/wishlist/services/wishlist.service";

export async function wishlistToggle(productId: string): Promise<void> {
  const prev = useWishlistStore.getState().productIds;
  useWishlistStore.getState().toggle(productId);

  if (!isAuthenticatedForCartWishlist()) return;

  try {
    const { productIds } = await toggleWishlistItem(productId);
    useWishlistStore.getState().setProductIds(productIds);
  } catch (error) {
    useWishlistStore.getState().setProductIds(prev);
    toast.error(getApiErrorMessage(error, "Could not update wishlist"));
  }
}
