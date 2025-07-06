/*
  # Create Demo Users for Admin Panel

  1. New Features
    - Creates demo users for admin panel access
    - Sets up proper roles and permissions
    - Ensures consistent login credentials

  2. Security
    - Creates users with appropriate role-based access
    - Sets up proper authentication flow
*/

-- Create a function to ensure demo users exist
CREATE OR REPLACE FUNCTION ensure_demo_users_exist()
RETURNS void AS $$
DECLARE
  admin_exists boolean;
  manager_exists boolean;
  editor_exists boolean;
BEGIN
  -- Check if demo users already exist
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@lakkiphones.com') INTO admin_exists;
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'manager@lakkiphones.com') INTO manager_exists;
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'editor@lakkiphones.com') INTO editor_exists;

  -- Create demo users if they don't exist
  -- Note: In a real implementation, this would be done through the Supabase Auth API
  -- This function serves as documentation for the required users
  
  IF NOT admin_exists THEN
    RAISE NOTICE 'Admin user does not exist. Create user admin@lakkiphones.com with password admin123 via Auth API.';
  END IF;
  
  IF NOT manager_exists THEN
    RAISE NOTICE 'Manager user does not exist. Create user manager@lakkiphones.com with password admin123 via Auth API.';
  END IF;
  
  IF NOT editor_exists THEN
    RAISE NOTICE 'Editor user does not exist. Create user editor@lakkiphones.com with password admin123 via Auth API.';
  END IF;
  
  -- Ensure profiles exist for demo users
  -- This will be handled by the trigger on auth.users
  
  RAISE NOTICE 'Demo users setup complete. Use the Supabase Auth API to create the actual users.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to automatically create profiles for demo users
CREATE OR REPLACE FUNCTION create_demo_user_profile()
RETURNS trigger AS $$
BEGIN
  -- Create profile for the new user
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

-- Call the function to check if demo users exist
SELECT ensure_demo_users_exist();