import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AboutPage,
  CartItem,
  DeliveryAddress,
  Product,
  Promotion,
  ShoppingItem,
  StoreConfig,
} from "../backend.d";
import type { PaymentMethod } from "../backend.d";
import { useActor } from "./useActor";

export function useInitializeStore() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["initStore"],
    queryFn: async () => {
      if (!actor) return null;
      await actor.initializeStore();
      return true;
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOnSaleProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "onSale"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOnSaleProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "all") return actor.getAllProducts();
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePromotions() {
  const { actor, isFetching } = useActor();
  return useQuery<Promotion[]>({
    queryKey: ["promotions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPromotions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAboutPage() {
  const { actor, isFetching } = useActor();
  return useQuery<AboutPage>({
    queryKey: ["aboutPage"],
    queryFn: async () => {
      if (!actor) return { instagramHandle: "", aboutText: "" };
      return actor.getAboutPage();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCart() {
  const { actor, isFetching } = useActor();
  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCartTotal() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["cartTotal"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCartTotal();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error("No actor");
      await actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartTotal"] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("No actor");
      await actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartTotal"] });
    },
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      newQuantity,
    }: { productId: string; newQuantity: bigint }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateCartItem(productId, newQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartTotal"] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      deliveryAddress,
      paymentMethod,
    }: {
      deliveryAddress: DeliveryAddress;
      paymentMethod: PaymentMethod;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createOrder(deliveryAddress, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartTotal"] });
    },
  });
}

export function useStoreConfig() {
  const { actor, isFetching } = useActor();
  return useQuery<StoreConfig>({
    queryKey: ["storeConfig"],
    queryFn: async () => {
      if (!actor) return { upiId: "9928988190@paytm" };
      return actor.getStoreConfig();
    },
    enabled: !!actor && !isFetching,
  });
}
