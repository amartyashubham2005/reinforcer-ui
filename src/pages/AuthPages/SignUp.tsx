import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Reinforcer SignUp Dashboard | Reinforcer : LLM-Powered OBM ABC Analysis Tool"
        description="This is Reinforcer SignUp Tables Dashboard page for Reinforcer - LLM-Powered OBM ABC Analysis Tool"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
