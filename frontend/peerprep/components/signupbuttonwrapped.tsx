import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

interface SignUpButtonWrappedProps {
  label: string;
}

export const SignUpButtonWrapped: React.FC<SignUpButtonWrappedProps> = ({
  label,
}) => {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push("/sign-up"); // Navigate to /sign-in page
  };

  return (
    <Button
      radius="md"
      className="hover:bg-gradient-to-tr from-fuchsia-500 to-violet-600 text-violet-600 hover:text-white dark:text-white shadow-lg border-violet-600"
      variant="ghost"
      color="secondary"
      onClick={handleSignUpClick}
    >
      {label}
    </Button>
  );
};
