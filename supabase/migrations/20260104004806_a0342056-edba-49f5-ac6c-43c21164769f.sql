-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

-- Create policy that allows service role to insert orders (for webhook)
CREATE POLICY "Service role can insert orders"
ON public.orders
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow authenticated users to insert their own orders
CREATE POLICY "Users can insert own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());