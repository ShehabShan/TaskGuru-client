import SocialLogin from "../Authentication/SocialLogin";

const WelcomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <main className="w-full max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Welcome to TaskMaster
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Streamline your productivity with our intuitive task management
          solution.
        </p>

        {/* Placeholder for your Google Sign-In component */}
        <div className="mb-4">
          {/* Replace this comment with your Google Sign-In component */}
          {/* <YourGoogleSignInComponent /> */}
        </div>

        {/* Fallback button in case the component isn't inserted */}

        <SocialLogin></SocialLogin>
      </main>
    </div>
  );
};

export default WelcomePage;
