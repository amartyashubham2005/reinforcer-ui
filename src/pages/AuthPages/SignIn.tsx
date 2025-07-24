import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Reinforcer SignIn Dashboard | Reinforcer : LLM-Powered OBM ABC Analysis Tool"
        description="This is Reinforcer SignIn Tables Dashboard page for Reinforcer - LLM-Powered OBM ABC Analysis Tool"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
