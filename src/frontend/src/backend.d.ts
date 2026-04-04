import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Promotion {
    title: string;
    discountInfo: string;
    description: string;
    imageUrl: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface OrderRecord {
    id: string;
    status: OrderStatus;
    deliveryAddress: DeliveryAddress;
    paymentMethod: PaymentMethod;
    user: Principal;
    totalAmount: bigint;
    timestamp: Time;
    items: Array<OrderItem>;
}
export interface OrderItem {
    productId: string;
    quantity: bigint;
    priceAtOrder: bigint;
}
export interface AboutPage {
    instagramHandle: string;
    aboutText: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface StoreConfig {
    upiId: string;
}
export interface DeliveryAddress {
    city: string;
    fullName: string;
    state: string;
    addressLine1: string;
    addressLine2: string;
    phone: string;
    pincode: string;
}
export interface Product {
    id: string;
    stockQuantity: bigint;
    isOnSale: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    salePrice?: bigint;
    price: bigint;
}
export interface UserProfile {
    name: string;
}
export enum IdempotenceResult {
    success = "success",
    alreadyInitialized = "alreadyInitialized"
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    paid = "paid",
    delivered = "delivered"
}
export enum PaymentMethod {
    cod = "cod",
    upi = "upi"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addPromotion(promotion: Promotion): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(deliveryAddress: DeliveryAddress, paymentMethod: PaymentMethod): Promise<string>;
    deleteProduct(productId: string): Promise<void>;
    getAboutPage(): Promise<AboutPage>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCartTotal(): Promise<bigint>;
    getMyOrders(): Promise<Array<OrderRecord>>;
    getOnSaleProducts(): Promise<Array<Product>>;
    getOrder(orderId: string): Promise<OrderRecord>;
    getOrdersAdmin(): Promise<Array<OrderRecord>>;
    getProduct(productId: string): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getPromotions(): Promise<Array<Promotion>>;
    getStoreConfig(): Promise<StoreConfig>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<IdempotenceResult>;
    initializeStore(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    removeFromCart(productId: string): Promise<void>;
    removePromotion(title: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAboutPage(newAboutPage: AboutPage): Promise<void>;
    updateCartItem(productId: string, newQuantity: bigint): Promise<void>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
