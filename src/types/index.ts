export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  createdAt: string;
}

export interface Affiliate {
  id: string;
  name: string;
  description: string;
  robloxUrl: string;
  discordUrl: string;
  image: string;
  createdAt: string;
}

export interface Credentials {
  username: string;
  password: string;
}
