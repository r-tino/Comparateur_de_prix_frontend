export type StoreRating = {
    name: string;
    store: string;
    price: number;
    rating: number;
    stock: number;
    sellerName: string;
    sellerImage: string;
    sellerAddress: string;
    sellerContact: string;
    sellerEmail: string;
    sellerDescription: string;
  };
  
  export type Product = {
    id: number;
    name: string;
    image: string;
    price: number;
    rating: number;
    description: string;
    storeRatings: StoreRating[];
  };
  