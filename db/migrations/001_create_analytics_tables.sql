-- Migration: Create analytics tables for transactions and promo redemptions

-- Transactions table (if your project already has one, these columns are additive)
CREATE TABLE IF NOT EXISTS public.transactions (
  id BIGSERIAL PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  points_earned INT NOT NULL DEFAULT 0,
  product_name TEXT,
  product_price INT,
  quantity INT,
  note TEXT,
  cashier_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Promo redemptions audit table
CREATE TABLE IF NOT EXISTS public.promo_redemptions (
  id BIGSERIAL PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  promo_id BIGINT REFERENCES public.promos(id) ON DELETE SET NULL,
  points_spent INT NOT NULL,
  remaining_points INT NOT NULL,
  operator UUID,
  note TEXT,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Example RPC function to perform an atomic redemption (optional)
-- Adjust function privileges and RLS policies as needed before enabling in production.

CREATE OR REPLACE FUNCTION public.redeem_promo_atomic(p_member_id uuid, p_promo_id bigint, p_operator uuid DEFAULT NULL)
RETURNS TABLE(new_points int) AS $$
DECLARE
  v_points int;
  v_cost int;
BEGIN
  -- Lock the member row FOR UPDATE to avoid race conditions
  SELECT points INTO v_points FROM public.members WHERE id = p_member_id FOR UPDATE;
  IF v_points IS NULL THEN
    RAISE EXCEPTION 'Member not found';
  END IF;

  SELECT point_cost INTO v_cost FROM public.promos WHERE id = p_promo_id;
  IF v_cost IS NULL THEN
    RAISE EXCEPTION 'Promo not found';
  END IF;

  IF v_points < v_cost THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;

  -- deduct and insert redemption record
  UPDATE public.members SET points = points - v_cost WHERE id = p_member_id;
  INSERT INTO public.promo_redemptions(member_id, promo_id, points_spent, remaining_points, operator)
    VALUES (p_member_id, p_promo_id, v_cost, v_points - v_cost, p_operator);

  RETURN QUERY SELECT (v_points - v_cost)::int;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
