export interface TabNewsPost {
  id: string;
  owner_id: string;
  parent_id: string | null;
  slug: string;
  title: string;
  body: string;
  status: string;
  source_url: string | null;
  created_at: string;
  updated_at: string;
  published_at: string;
  deleted_at: string | null;
  owner_username: string;
  tabcoins: number;
  children_deep_count: number;
}

export interface TabNewsUser {
  id: string;
  username: string;
  email: string;
  notifications: boolean;
  features: string[];
  tabcoins: number;
  tabcash: number;
  created_at: string;
  updated_at: string;
}