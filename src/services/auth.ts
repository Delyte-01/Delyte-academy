import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

async function login(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

async function signup(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
}

async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

async function logout() {
  return supabase.auth.signOut();
}

export const authService = {
  login,
  signup,
  logout,
  signInWithGoogle
};
