// Static components
import SignUpForm from "./signup-form";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-3xl font-semibold text-center mb-4">Sign up</h2>
      <SignUpForm />
    </div>
  );
}
