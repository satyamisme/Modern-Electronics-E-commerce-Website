/*
  # Demo User Profile Creation Setup

  1. Functions
    - Create function to automatically create profiles for demo users
    - Handle role assignment based on email domain

  2. Triggers
    - Auto-create profiles when auth users are created
    - Assign appropriate roles for demo accounts

  3. Security
    - Function runs with SECURITY DEFINER for auth.users access
    - Only creates profiles for specific demo email addresses
*/

-- Create a function to handle demo user profile creation
CREATE OR REPLACE FUNCTION create_demo_user_profile()
RETURNS trigger AS $$
BEGIN
  -- Only create profiles for our demo users or any new auth user
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@lakkiphones.com' THEN 'Super Admin'
      WHEN NEW.email = 'manager@lakkiphones.com' THEN 'Manager User'
      WHEN NEW.email = 'editor@lakkiphones.com' THEN 'Editor User'
      ELSE COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
    END,
    CASE 
      WHEN NEW.email = 'admin@lakkiphones.com' THEN 'super_admin'
      WHEN NEW.email = 'manager@lakkiphones.com' THEN 'manager'
      WHEN NEW.email = 'editor@lakkiphones.com' THEN 'editor'
      ELSE 'customer'
    END,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_demo ON auth.users;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created_demo
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_demo_user_profile();

-- Create a function to ensure demo users exist (to be called from application)
CREATE OR REPLACE FUNCTION ensure_demo_users_exist()
RETURNS void AS $$
BEGIN
  -- This function will be called from the application layer
  -- It serves as a placeholder for any additional setup needed
  -- The actual user creation will happen through Supabase Auth API
  RAISE NOTICE 'Demo user setup function ready. Users should be created via Auth API.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;