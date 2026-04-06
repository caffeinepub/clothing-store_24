import Stripe "stripe/stripe";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import OutCall "http-outcalls/outcall";
import Runtime "mo:core/Runtime";

import Principal "mo:core/Principal";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use migration on upgrade

actor {
  // Custom Types
  public type DeliveryAddress = {
    fullName : Text;
    phone : Text;
    addressLine1 : Text;
    addressLine2 : Text;
    city : Text;
    state : Text;
    pincode : Text;
  };

  public type PaymentMethod = {
    #upi;
    #cod;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat; // cents
    category : Text;
    imageUrl : Text;
    stockQuantity : Nat;
    isOnSale : Bool;
    salePrice : ?Nat; // in cents
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.id, product2.id);
    };
  };

  public type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
    priceAtOrder : Nat;
  };

  public type OrderStatus = {
    #pending;
    #paid;
    #shipped;
    #delivered;
  };

  public type OrderRecord = {
    id : Text;
    items : [OrderItem];
    user : Principal;
    totalAmount : Nat; // in cents
    status : OrderStatus;
    timestamp : Time.Time;
    deliveryAddress : DeliveryAddress;
    paymentMethod : PaymentMethod;
  };

  module OrderRecord {
    public func compareByTimestamp(a : OrderRecord, b : OrderRecord) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  type Promotion = {
    title : Text;
    description : Text;
    discountInfo : Text;
    imageUrl : Text;
  };

  type AboutPage = {
    instagramHandle : Text;
    aboutText : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type StoreConfig = {
    upiId : Text;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let products = Map.empty<Text, Product>();
  let promotions = Map.empty<Text, Promotion>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Text, OrderRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var aboutPage : AboutPage = {
    instagramHandle = "d_naruto_king";
    aboutText = "We are DS Trending Store — a luxury fashion brand born from a love of regal elegance and modern style. Our collections draw inspiration from royal courts and haute couture, bringing you pieces that make every day feel like a coronation.";
  };

  var orderCounter = 0;
  var configuration : ?Stripe.StripeConfiguration = null;

  var storeConfig : StoreConfig = {
    upiId = "9928988190@axl";
  };

  // Utility functions
  func generateOrderId() : Text {
    orderCounter += 1;
    "order_" # orderCounter.toText();
  };

  func checkProductExists(productId : Text) {
    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
  };

  func getProductInternal(productId : Text) : Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin Product Management
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    checkProductExists(product.id);
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    checkProductExists(productId);
    products.remove(productId);
  };

  // Product Queries (Public - no authorization needed)
  public query ({ caller }) func getProduct(productId : Text) : async Product {
    checkProductExists(productId);
    getProductInternal(productId);
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    let filteredProducts = products.values().toArray().filter(
      func(p) { Text.equal(p.category, category) }
    );
    filteredProducts;
  };

  public query ({ caller }) func getOnSaleProducts() : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.isOnSale }
    );
    filtered;
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let lowerSearch = searchTerm.toLower();
    let filtered = products.values().toArray().filter(
      func(p) {
        p.name.toLower().contains(#text lowerSearch) or p.description.toLower().contains(#text lowerSearch)
      }
    );
    filtered;
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Promotions Management (Admin)
  public shared ({ caller }) func addPromotion(promotion : Promotion) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add promotions");
    };
    promotions.add(promotion.title, promotion);
  };

  public shared ({ caller }) func removePromotion(title : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove promotions");
    };
    promotions.remove(title);
  };

  public query ({ caller }) func getPromotions() : async [Promotion] {
    promotions.values().toArray();
  };

  // Cart Management (User)
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    checkProductExists(productId);
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let existingCartArray = existingCart.toArray();
    let cartWithoutItem = existingCartArray.filter(
      func(item) { not Text.equal(item.productId, productId) }
    );

    let newItem = { productId; quantity };
    let updatedCart = List.fromArray<CartItem>(cartWithoutItem.concat([newItem]));
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let cartArray = existingCart.toArray();
    let filteredCartArray = cartArray.filter(
      func(item) { not Text.equal(item.productId, productId) }
    );

    let updatedCart = List.fromArray<CartItem>(filteredCartArray);
    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func updateCartItem(productId : Text, newQuantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };
    checkProductExists(productId);
    if (newQuantity == 0) {
      await removeFromCart(productId);
      return;
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let cartArray = existingCart.toArray();
    let cartWithoutItem = cartArray.filter(
      func(item) { not Text.equal(item.productId, productId) }
    );

    let newItem = { productId; quantity = newQuantity };
    let updatedCart = List.fromArray<CartItem>(cartWithoutItem.concat([newItem]));
    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCartTotal() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart total");
    };
    switch (carts.get(caller)) {
      case (null) { return 0 };
      case (?cart) {
        let cartArray = cart.toArray();
        var total = 0;
        for (item in cartArray.values()) {
          let product = getProductInternal(item.productId);
          let price = if (product.isOnSale and product.salePrice != null) {
            switch (product.salePrice) {
              case (null) { product.price };
              case (?sale) { sale };
            };
          } else { product.price };
          total += price * item.quantity;
        };
        total;
      };
    };
  };

  // Order Management
  public shared ({ caller }) func createOrder(deliveryAddress : DeliveryAddress, paymentMethod : PaymentMethod) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let userCart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    if (userCart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let cartArray = userCart.toArray();

    var total = 0;
    let orderItems = cartArray.map(
      func(item) {
        let product = getProductInternal(item.productId);
        let price = if (product.isOnSale and product.salePrice != null) {
          switch (product.salePrice) {
            case (null) { product.price };
            case (?sale) { sale };
          };
        } else { product.price };
        total += price * item.quantity;
        {
          productId = item.productId;
          quantity = item.quantity;
          priceAtOrder = price;
        };
      }
    );

    let newOrder = {
      id = generateOrderId();
      items = orderItems;
      user = caller;
      totalAmount = total;
      status = #pending;
      timestamp = Time.now();
      deliveryAddress;
      paymentMethod;
    };

    orders.add(newOrder.id, newOrder);
    carts.add(caller, List.empty<CartItem>());
    newOrder.id;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async OrderRecord {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own order");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    let filteredOrders = orders.values().toArray().filter(
      func(o) { o.user == caller }
    );
    filteredOrders.sort(OrderRecord.compareByTimestamp);
  };

  public query ({ caller }) func getOrdersAdmin() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort(OrderRecord.compareByTimestamp);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          items = order.items;
          user = order.user;
          totalAmount = order.totalAmount;
          status = newStatus;
          timestamp = order.timestamp;
          deliveryAddress = order.deliveryAddress;
          paymentMethod = order.paymentMethod;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Stripe Integration
  public query ({ caller }) func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // About Page Management
  public query ({ caller }) func getAboutPage() : async AboutPage {
    aboutPage;
  };

  public shared ({ caller }) func updateAboutPage(newAboutPage : AboutPage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update about page");
    };
    aboutPage := newAboutPage;
  };

  // Store Config (UPI ID)
  public query ({ caller }) func getStoreConfig() : async StoreConfig {
    storeConfig;
  };

  // Initialization & Seeding
  public shared ({ caller }) func initializeStore() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize store");
    };

    let sampleProducts = [
      {
        id = "product1";
        name = "Classic White T-Shirt";
        description = "Soft cotton white t-shirt";
        price = 1999;
        category = "tops";
        imageUrl = "https://example.com/images/white-tshirt.jpg";
        stockQuantity = 50;
        isOnSale = false;
        salePrice = null;
      },
      {
        id = "product2";
        name = "Blue Jeans";
        description = "Versatile denim blue jeans";
        price = 3999;
        category = "bottoms";
        imageUrl = "https://example.com/images/blue-jeans.jpg";
        stockQuantity = 40;
        isOnSale = false;
        salePrice = null;
      },
      {
        id = "product3";
        name = "Floral Summer Dress";
        description = "Colorful summer dress with floral pattern";
        price = 4999;
        category = "dresses";
        imageUrl = "https://example.com/images/floral-dress.jpg";
        stockQuantity = 30;
        isOnSale = true;
        salePrice = ?3999;
      },
      {
        id = "product4";
        name = "Denim Jacket";
        description = "Lightweight denim jacket for all seasons";
        price = 5999;
        category = "outerwear";
        imageUrl = "https://example.com/images/denim-jacket.jpg";
        stockQuantity = 25;
        isOnSale = false;
        salePrice = null;
      },
      {
        id = "product5";
        name = "Striped Dress Shirt";
        description = "Formal striped dress shirt";
        price = 2999;
        category = "tops";
        imageUrl = "https://example.com/images/striped-shirt.jpg";
        stockQuantity = 35;
        isOnSale = true;
        salePrice = ?2499;
      },
      {
        id = "product6";
        name = "Leather Belt";
        description = "Genuine leather belt";
        price = 1499;
        category = "accessories";
        imageUrl = "https://example.com/images/leather-belt.jpg";
        stockQuantity = 60;
        isOnSale = false;
        salePrice = null;
      },
      {
        id = "product7";
        name = "Black Leggings";
        description = "Comfortable black leggings";
        price = 1999;
        category = "bottoms";
        imageUrl = "https://example.com/images/black-leggings.jpg";
        stockQuantity = 45;
        isOnSale = false;
        salePrice = null;
      },
      {
        id = "product8";
        name = "Hooded Sweatshirt";
        description = "Cozy hooded sweatshirt";
        price = 2499;
        category = "tops";
        imageUrl = "https://example.com/images/hooded-sweatshirt.jpg";
        stockQuantity = 55;
        isOnSale = false;
        salePrice = null;
      },
    ];

    for (product in sampleProducts.values()) {
      products.add(product.id, product);
    };
  };

  // Initialization check (run at canister deploy time)
  public type IdempotenceResult = {
    #alreadyInitialized;
    #success;
  };

  public shared ({ caller }) func initialize() : async IdempotenceResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize");
    };
    if (products.containsKey("product1")) { return #alreadyInitialized };

    let p : Product = {
      id = "product1";
      name = "Classic White T-Shirt";
      description = "Soft cotton white t-shirt";
      price = 1999;
      category = "tops";
      imageUrl = "https://example.com/images/white-tshirt.jpg";
      stockQuantity = 50;
      isOnSale = false;
      salePrice = null;
    };

    products.add("product1", p);
    switch (await initializeStore()) {
      case (_) { #success };
    };
  };
};

