-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ENUMS
create type user_role as enum ('admin', 'customer');
create type order_status as enum ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
create type contact_type as enum ('Client', 'Supplier');
create type contact_status as enum ('Active', 'Inactive');

-- 2. TABLES

-- Profiles (extends Auth Users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  role user_role default 'customer',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Addresses (as used in db.ts)
create table public.user_addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text,
  phone text,
  address text,
  city text,
  zip text,
  country text,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, is_default) -- Partial index might be better but this ensures one default per user if handled carefully, or just simple table
);

-- Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique, -- useful for SEO
  image_url text,
  description text,
  product_count integer default 0, -- maintained via trigger or computed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique,
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  description text,
  category_id uuid references public.categories(id) on delete set null,
  category text, -- Legacy field/Denormalized name if needed for frontend compatibility (optional)
  main_image_url text,
  gallery_images text[],
  rating_rate numeric(3, 2) default 0,
  rating_count integer default 0,
  stock integer default 0, -- matched to db.ts
  ft_url text,
  fi_url text,
  is_active boolean default true, -- matched to db.ts
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text,
  customer_email text,
  status order_status default 'Pending',
  total_amount numeric(10, 2) not null,
  shipping_address jsonb, -- Storing full address snapshot
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Contacts
create table public.contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  type contact_type default 'Client',
  company text,
  ice text,
  address text,
  status contact_status default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Banners
create table public.banners (
  id uuid default uuid_generate_v4() primary key,
  title text,
  subtitle text,
  image_url text not null,
  cta text, -- matched db.ts
  link text, -- matched db.ts
  align text check (align in ('left', 'center', 'right')), -- matched db.ts
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Menu Items
create table public.menu_items (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  view_route text, -- matched db.ts
  icon_name text, -- matched db.ts
  sort_order integer default 0, -- matched db.ts
  is_special boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Settings (App Config)
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS POLICIES

alter table public.profiles enable row level security;
alter table public.user_addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contacts enable row level security;
alter table public.banners enable row level security;
alter table public.menu_items enable row level security;
alter table public.settings enable row level security;

-- Public Read
create policy "Public Read Categories" on public.categories for select using (true);
create policy "Public Read Products" on public.products for select using (is_active = true);
create policy "Public Read Banners" on public.banners for select using (true);
create policy "Public Read Menu Items" on public.menu_items for select using (true);
create policy "Public Read Settings" on public.settings for select using (true);

-- User Access
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can read own addresses" on public.user_addresses for select using (auth.uid() = user_id);
create policy "Users can insert own addresses" on public.user_addresses for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses" on public.user_addresses for update using (auth.uid() = user_id);
create policy "Users can delete own addresses" on public.user_addresses for delete using (auth.uid() = user_id);

create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can view own order items" on public.order_items for select using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

-- Admin Access (Simplified)
-- For this schema, we will just create a policy that allows all operations for authenticated users who have role 'admin' in profiles
-- NOTE: You must ensure a profile with role 'admin' exists.

-- Helper function to check admin status (bypasses RLS to avoid recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

create policy "Admin All Profiles" on public.profiles for all using (public.is_admin());
create policy "Admin All Categories" on public.categories for all using (public.is_admin());
create policy "Admin All Products" on public.products for all using (public.is_admin());
create policy "Admin All Orders" on public.orders for all using (public.is_admin());
create policy "Admin All Order Items" on public.order_items for all using (public.is_admin());
create policy "Admin All Contacts" on public.contacts for all using (public.is_admin());
create policy "Admin All Banners" on public.banners for all using (public.is_admin());
create policy "Admin All Menu Items" on public.menu_items for all using (public.is_admin());
create policy "Admin All Settings" on public.settings for all using (public.is_admin());


-- 4. TRIGGERS

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_profiles_updated_at before update on public.profiles for each row execute procedure update_updated_at_column();
create trigger update_products_updated_at before update on public.products for each row execute procedure update_updated_at_column();
create trigger update_orders_updated_at before update on public.orders for each row execute procedure update_updated_at_column();

-- New User Handler
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
