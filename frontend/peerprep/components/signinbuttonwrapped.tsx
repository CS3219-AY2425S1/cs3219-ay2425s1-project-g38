import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export const SignInButtonWrapped = () => {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push("/sign-in"); // Navigate to /sign-in page
  };

  return (
    <Button variant="light" onClick={handleSignInClick}>
      <u>Sign-in</u>
    </Button>
  );
};
