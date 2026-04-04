import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import List "mo:core/List";
import Text "mo:core/Text";
import Stripe "stripe/stripe";

module {
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

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageUrl : Text;
    stockQuantity : Nat;
    isOnSale : Bool;
    salePrice : ?Nat;
  };

  public type CartItem = {
    productId : Text;
    quantity : Nat;
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
    totalAmount : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
    deliveryAddress : DeliveryAddress;
    paymentMethod : PaymentMethod;
  };

  public type Promotion = {
    title : Text;
    description : Text;
    discountInfo : Text;
    imageUrl : Text;
  };

  public type AboutPage = {
    instagramHandle : Text;
    aboutText : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type StoreConfig = {
    upiId : Text;
  };

  public type ShoppingItem = {
    currency : Text;
    productName : Text;
    productDescription : Text;
    priceInCents : Nat;
    quantity : Nat;
  };

  public type NewActor = {
    products : Map.Map<Text, Product>;
    promotions : Map.Map<Text, Promotion>;
    carts : Map.Map<Principal, List.List<CartItem>>;
    orders : Map.Map<Text, OrderRecord>;
    userProfiles : Map.Map<Principal, UserProfile>;
    orderCounter : Nat;
    aboutPage : AboutPage;
    configuration : ?Stripe.StripeConfiguration;
    storeConfig : StoreConfig;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
    priceAtOrder : Nat;
  };

  public type OldOrderRecord = {
    id : Text;
    items : [OrderItem];
    user : Principal;
    totalAmount : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  public type OldActor = {
    products : Map.Map<Text, Product>;
    promotions : Map.Map<Text, Promotion>;
    carts : Map.Map<Principal, List.List<CartItem>>;
    orders : Map.Map<Text, OldOrderRecord>;
    userProfiles : Map.Map<Principal, UserProfile>;
    orderCounter : Nat;
    aboutPage : AboutPage;
    configuration : ?Stripe.StripeConfiguration;
  };

  public func run(old : OldActor) : NewActor {
    // Helper function to convert old order to new order with dummy values
    func convertOrder(oldOrder : OldOrderRecord) : OrderRecord {
      {
        id = oldOrder.id;
        items = oldOrder.items;
        user = oldOrder.user;
        totalAmount = oldOrder.totalAmount;
        status = oldOrder.status;
        timestamp = oldOrder.timestamp;
        deliveryAddress = {
          fullName = "";
          phone = "";
          addressLine1 = "";
          addressLine2 = "";
          city = "";
          state = "";
          pincode = "";
        };
        paymentMethod = #cod; // or #upi as default
      };
    };

    // Create new store config with UPI id
    let newStoreConfig : StoreConfig = {
      upiId = "9928988190@axl";
    };

    // Convert orders
    let newOrders = old.orders.map<Text, OldOrderRecord, OrderRecord>(
      func(_id, oldOrder) { convertOrder(oldOrder) }
    );

    // Return updated state with all fields
    {
      products = old.products;
      promotions = old.promotions;
      carts = old.carts;
      orders = newOrders;
      userProfiles = old.userProfiles;
      orderCounter = old.orderCounter;
      aboutPage = old.aboutPage;
      configuration = old.configuration;
      storeConfig = newStoreConfig;
    };
  };
};
