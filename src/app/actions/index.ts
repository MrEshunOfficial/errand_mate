// app/actions.ts
'use server'

import { signIn, signOut } from "@/auth"
import { invalidateUserSessions } from "@/auth" // Import the session invalidation function
import { auth } from "@/auth"
import { User } from "@/models/authentication/authModel"
import { connect } from "@/lib/dbconfigue/dbConfigue"
import { revalidatePath } from "next/cache"

export async function doSocialLogin(formData: FormData) {
  const action = formData.get("action") as string
     
  if (!action) {
    throw new Error("Provider action is required")
  }
 
  try {
    await signIn(action, { redirectTo: "/" })
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}

export async function doLogout() {
  try {
    const session = await auth()
    
    // If user is logged in, invalidate all their sessions
    if (session?.user?.id) {
      await invalidateUserSessions(session.user.id)
    }
    
    // Clear the current session and redirect
    await signOut({ 
      redirectTo: '/user/login',
      redirect: true 
    })
    
    // Revalidate paths to ensure clean state
    revalidatePath('/')
    revalidatePath('/user/login')
  } catch (error) {
    console.error("Logout error:", error)
    // Even if there's an error, try to sign out
    await signOut({ redirectTo: '/user/login' })
  }
}

export async function deleteAccount() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    
    await connect()
    
    // Invalidate all sessions for this user first
    await invalidateUserSessions(session.user.id)
    
    // Delete user from database
    await User.findByIdAndDelete(session.user.id)
    
    // Sign out the user
    await signOut({ 
      redirectTo: '/user/login',
      redirect: true 
    })
    
    // Revalidate paths
    revalidatePath('/')
    revalidatePath('/user/login')
    
    return { success: true, message: "Account deleted successfully" }
    
  } catch (error) {
    console.error("Account deletion error:", error)
    throw new Error("Failed to delete account")
  }
}

// Function to force logout all sessions for a user (useful for admin actions)
export async function forceLogoutUser(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required")
    }
    
    // Invalidate all sessions for the specified user
    await invalidateUserSessions(userId)
    
    return { success: true, message: "User sessions invalidated" }
    
  } catch (error) {
    console.error("Force logout error:", error)
    throw new Error("Failed to force logout user")
  }
}