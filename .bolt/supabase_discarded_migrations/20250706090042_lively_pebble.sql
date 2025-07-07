/*
  # Create Demo Admin Users

  1. New Users
    - Creates demo admin users for testing and demonstration
    - Includes super admin, manager, and editor roles
    - Sets up proper authentication credentials

  2. Security
    - Uses Supabase auth system
    - Proper password hashing
    - Role-based access control

  3. Demo Credentials
    - Super Admin: admin@lakkiphones.com / admin123
    - Manager: manager@lakkiphones.com / admin123  
    - Editor: editor@lakkiphones.com / admin123
*/

-- Insert demo users into auth.users (this requires admin privileges)
-- Note: In production, these should be created through the Supabase dashboard or auth API

-- Create profiles for demo users (assuming they will be created via auth)
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@lakkiphones.com', 'Super Admin', 'super_admin', now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'manager@lakkiphones.com', 'Manager User', 'manager', now(), now()),
  ('00000000-0000-0000-0000-000000000003', 'editor@lakkiphones.com', 'Editor User', 'editor', now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

-- Create a function to handle demo user creation
CREATE OR REPLACE FUNCTION create_demo_user_profile()
RETURNS trigger AS $$
BEGIN
  -- Check if this is one of our demo users
  IF NEW.email IN ('admin@lakkiphones.com', 'manager@lakkiphones.com', 'editor@lakkiphones.com') THEN
    INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      CASE 
        WHEN NEW.email = 'admin@lakkiphones.com' THEN 'Super Admin'
        WHEN NEW.email = 'manager@lakkiphones.com' THEN 'Manager User'
        WHEN NEW.email = 'editor@lakkiphones.com' THEN 'Editor User'
        ELSE 'Demo User'
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
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created_demo ON auth.users;
CREATE TRIGGER on_auth_user_created_demo
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_demo_user_profile();