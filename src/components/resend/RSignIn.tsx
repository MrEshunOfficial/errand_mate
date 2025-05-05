import { doSocialLogin } from "@/app/actions";
import { Link } from "lucide-react";
import { JSX } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

export default function ResendSignIn(): JSX.Element {
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <form action={doSocialLogin}>
        <Button
          type="submit"
          name="action"
          value="resend"
          variant="secondary"
          className="w-full bg-white text-black hover:bg-gray-100"
        >
          <FcGoogle className="mr-2 h-4 lg:h-5 w-4 lg:w-5" />
          Sign in with magic link
        </Button>
      </form>

      <div className="text-center text-sm lg:text-base">
        <p className="text-white/80">
          {"Don't have an account? "}
          <Link
            href="/user/register"
            className="text-white hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="text-xs text-white/70 text-center">
        By signing in, you agree to our{" "}
        <Button
          variant="link"
          className="px-1 h-auto text-xs text-white hover:text-white/80"
        >
          Terms of Service
        </Button>{" "}
        and{" "}
        <Button
          variant="link"
          className="px-1 h-auto text-xs text-white hover:text-white/80"
        >
          Privacy Policy
        </Button>
      </div>
    </div>
  );
}
