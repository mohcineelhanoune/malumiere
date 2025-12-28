-- Fix infinite recursion in RLS policies by using a security definer function

-- 1. Create the helper function that bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing recursive policies
DROP POLICY IF EXISTS "Admin All Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin All Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin All Products" ON public.products;
DROP POLICY IF EXISTS "Admin All Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin All Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Admin All Contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admin All Banners" ON public.banners;
DROP POLICY IF EXISTS "Admin All Menu Items" ON public.menu_items;
DROP POLICY IF EXISTS "Admin All Settings" ON public.settings;

-- 3. Recreate policies using the safe function
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Order Items" ON public.order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Contacts" ON public.contacts FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Banners" ON public.banners FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Menu Items" ON public.menu_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin All Settings" ON public.settings FOR ALL USING (public.is_admin());
