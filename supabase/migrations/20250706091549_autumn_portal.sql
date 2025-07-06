/*
  # Demo User Profile Creation

  1. New Functions
    - `create_demo_user_profile` - Function to create profiles for new auth users
    - `ensure_demo_users_exist` - Helper function for application layer

  2. Security
    - Uses SECURITY DEFINER to ensure proper permissions
    - Handles profile creation for all new auth users
    - Special handling for demo admin accounts
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

-- Create a function to ensure demo users exist (to be called from application layer)
CREATE OR REPLACE FUNCTION ensure_demo_users_exist()
RETURNS void AS $$
BEGIN
  -- This function will be called from the application layer
  -- It serves as a placeholder for any additional setup needed
  -- The actual user creation will happen through Supabase Auth API
  RAISE NOTICE 'Demo user setup function ready. Users should be created via Auth API.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;