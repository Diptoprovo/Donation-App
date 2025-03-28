
import AuthForm from '@/components/AuthForm';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthForm type="signup" />
      </div>
    </div>
  );
};

export default SignUp;
