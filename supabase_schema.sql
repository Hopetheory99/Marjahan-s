-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Managed by Supabase Auth, but we extend it)
-- We'll use the public.users table to store additional user data if needed, 
-- but primarily we rely on auth.users. 
-- For this app, we'll create a public profile table linked to auth.users.

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text check (role in ('customer', 'admin')) default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  stock integer default 0 not null,
  category text not null,
  metal text not null,
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  status text check (status in ('pending_payment', 'pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'failed')) default 'pending_payment',
  total decimal(10,2) not null,
  stripe_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Order Items Table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products not null,
  quantity integer not null,
  price_snapshot decimal(10,2) not null -- Price at time of purchase
);

-- 5. Wishlists Table
create table public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- 6. Reviews Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.reviews enable row level security;

-- Profiles Policies
create policy "Users can view own profile." on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Products Policies
create policy "Products are viewable by everyone." on public.products
  for select using (true);

create policy "Admins can insert products." on public.products
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update products." on public.products
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete products." on public.products
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Orders Policies
create policy "Users can view own orders." on public.orders
  for select using (auth.uid() = user_id);

create policy "Admins can view all orders." on public.orders
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can create orders." on public.orders
  for insert with check (auth.uid() = user_id);

-- Order Items Policies
create policy "Users can view own order items." on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
  );

create policy "Admins can view all order items." on public.order_items
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can create order items." on public.order_items
  for insert with check (
    exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid())
  );

-- Wishlists Policies
create policy "Users can view own wishlist." on public.wishlists
  for select using (auth.uid() = user_id);

create policy "Users can manage own wishlist." on public.wishlists
  for all using (auth.uid() = user_id);

-- Reviews Policies
create policy "Reviews are viewable by everyone." on public.reviews
  for select using (true);

create policy "Authenticated users can create reviews." on public.reviews
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own reviews." on public.reviews
  for update using (auth.uid() = user_id);

create policy "Users can delete own reviews." on public.reviews
  for delete using (auth.uid() = user_id);

-- TRIGGERS

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STOCK VALIDATION AND DATA INTEGRITY TRIGGERS

-- Function to validate stock before order creation
create or replace function public.validate_order_stock()
returns trigger as $$
declare
  available_stock integer;
  ordered_quantity integer;
begin
  -- Get the current stock for the product
  select stock into available_stock
  from public.products
  where id = new.product_id;

  -- Check if product exists
  if available_stock is null then
    raise exception 'Product does not exist';
  end if;

  -- Check if there's enough stock
  if available_stock < new.quantity then
    raise exception 'Insufficient stock. Available: %, Requested: %', available_stock, new.quantity;
  end if;

  return new;
end;
$$ language plpgsql;

-- Function to update stock when order is created
create or replace function public.update_stock_on_order()
returns trigger as $$
begin
  -- Decrease stock when order item is created
  update public.products
  set stock = stock - new.quantity
  where id = new.product_id;

  -- Log the stock change (optional)
  insert into public.stock_log (product_id, change_type, quantity_change, order_id, created_at)
  values (new.product_id, 'sale', -new.quantity, new.order_id, now());

  return new;
end;
$$ language plpgsql;

-- Function to restore stock when order is cancelled
create or replace function public.restore_stock_on_cancel()
returns trigger as $$
begin
  -- Only restore stock if status changed to cancelled
  if new.status = 'cancelled' and old.status != 'cancelled' then
    -- Restore stock for all items in this order
    update public.products
    set stock = stock + (
      select sum(quantity) from public.order_items where order_id = new.id
    )
    where id in (
      select product_id from public.order_items where order_id = new.id
    );

    -- Log the stock restoration
    insert into public.stock_log (product_id, change_type, quantity_change, order_id, created_at)
    select product_id, 'cancelled_order', quantity, new.id, now()
    from public.order_items
    where order_id = new.id;
  end if;

  return new;
end;
$$ language plpgsql;

-- Function to prevent negative stock
create or replace function public.prevent_negative_stock()
returns trigger as $$
begin
  if new.stock < 0 then
    raise exception 'Stock cannot be negative. Current: %, Attempted: %', old.stock, new.stock;
  end if;
  return new;
end;
$$ language plpgsql;

-- Function to validate review uniqueness (one review per user per product)
create or replace function public.validate_unique_review()
returns trigger as $$
begin
  if exists (
    select 1 from public.reviews
    where product_id = new.product_id
    and user_id = new.user_id
    and id != coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) then
    raise exception 'User has already reviewed this product';
  end if;
  return new;
end;
$$ language plpgsql;

-- Function to update product average rating
create or replace function public.update_product_rating()
returns trigger as $$
begin
  -- Recalculate average rating for the product
  update public.products
  set average_rating = (
    select avg(rating)::decimal(3,2)
    from public.reviews
    where product_id = coalesce(new.product_id, old.product_id)
  ),
  review_count = (
    select count(*)
    from public.reviews
    where product_id = coalesce(new.product_id, old.product_id)
  )
  where id = coalesce(new.product_id, old.product_id);

  return coalesce(new, old);
end;
$$ language plpgsql;

-- STOCK LOG TABLE (for audit trail)
create table public.stock_log (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products on delete cascade not null,
  change_type text check (change_type in ('sale', 'restock', 'adjustment', 'cancelled_order')) not null,
  quantity_change integer not null,
  order_id uuid references public.orders,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on stock_log
alter table public.stock_log enable row level security;

-- Stock log policies (admins only)
create policy "Admins can view stock log." on public.stock_log
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Add average_rating and review_count columns to products
alter table public.products
add column if not exists average_rating decimal(3,2) default 0,
add column if not exists review_count integer default 0;

-- CREATE TRIGGERS

-- Stock validation before order item creation
create trigger validate_order_stock_trigger
  before insert on public.order_items
  for each row execute procedure public.validate_order_stock();

-- Update stock when order is created
create trigger update_stock_on_order_trigger
  after insert on public.order_items
  for each row execute procedure public.update_stock_on_order();

-- Restore stock when order is cancelled
create trigger restore_stock_on_cancel_trigger
  after update on public.orders
  for each row execute procedure public.restore_stock_on_cancel();

-- Prevent negative stock
create trigger prevent_negative_stock_trigger
  before update on public.products
  for each row execute procedure public.prevent_negative_stock();

-- Validate unique reviews
create trigger validate_unique_review_trigger
  before insert or update on public.reviews
  for each row execute procedure public.validate_unique_review();

-- Update product ratings
create trigger update_product_rating_insert_trigger
  after insert on public.reviews
  for each row execute procedure public.update_product_rating();

create trigger update_product_rating_update_trigger
  after update on public.reviews
  for each row execute procedure public.update_product_rating();

create trigger update_product_rating_delete_trigger
  after delete on public.reviews
  for each row execute procedure public.update_product_rating();

-- INDEXES FOR PERFORMANCE

-- Products table indexes
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_metal on public.products(metal);
create index if not exists idx_products_price on public.products(price);
create index if not exists idx_products_stock on public.products(stock);

-- Orders table indexes
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at);

-- Order items indexes
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- Reviews indexes
create index if not exists idx_reviews_product_id on public.reviews(product_id);
create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_reviews_rating on public.reviews(rating);

-- Wishlists indexes
create index if not exists idx_wishlists_user_id on public.wishlists(user_id);
create index if not exists idx_wishlists_product_id on public.wishlists(product_id);

-- Stock log indexes
create index if not exists idx_stock_log_product_id on public.stock_log(product_id);
create index if not exists idx_stock_log_created_at on public.stock_log(created_at);
