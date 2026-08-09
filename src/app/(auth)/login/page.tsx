import LoginForm from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="mx-auto w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
