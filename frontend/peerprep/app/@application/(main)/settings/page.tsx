"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import BoxIcon from "@/components/boxicons";
import {
  Avatar,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { validateEmail, validateUsername } from "@/utils/utils";
import { ErrorModal } from "@/components/errormodal";
import { DeleteConfirmationModal } from "@/components/deleteconfirmationmodal";
import { PasswordConfirmationModal } from "@/components/passwordconfirmationmodal";
import {
  editUsername,
  verifyPassword,
  editEmailRequest,
  verifyEmailCode,
  deleteUser,
} from "@/auth/actions";
import { EmailVerificationModal } from "@/components/emailverificationmodal";
import { ChangePasswordModal } from "@/components/changepasswordmodal";
import { changePassword } from "@/auth/actions";
import { DeleteAccountModal } from "@/components/deleteaccountmodal";
import { useRouter } from "next/navigation";
import { SuccessModal } from "@/components/succesmodal";

type SettingsPageProps = {
  username: string;
  email: string;
};

export default function SettingsPage({ username, email }: SettingsPageProps) {
  const [formData, setFormData] = React.useState({
    username: username || "username",
    email: email || "email@email.com",
  });
  const [activeSection, setActiveSection] = React.useState("profile");
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [originalData, setOriginalData] = React.useState(formData);
  const [isErrorModalOpen, setIsErrorModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<
    "username" | "email" | "password" | "delete" | null
  >(null);
  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    React.useState(false);
  const router = useRouter();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  const hasChanges = (field: "username" | "email") =>
    formData[field] !== originalData[field];

  const handleInputChange = (field: "username" | "email", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordConfirm = async (password: string) => {
    try {
      const response = await verifyPassword(password);
      if (response.status === "success") {
        if (editTarget === "username") {
          setIsEditingUsername(true);
        } else if (editTarget === "email") {
          setIsEditingEmail(true);
        } else if (editTarget === "password") {
          setIsChangePasswordModalOpen(true);
        } else if (editTarget === "delete") {
          // Actually delete the account after password confirmation
          const deleteResponse = await deleteUser();
          if (deleteResponse.status === "success") {
            setSuccessMessage("Account deleted successfully. Redirecting...");
            setIsSuccessModalOpen(true);
            setTimeout(() => router.push("/sign-in"), 1500);
          } else {
            setErrorMessage(deleteResponse.message);
            setIsErrorModalOpen(true);
          }
        }
        setIsPasswordModalOpen(false);
        setEditTarget(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Password verification error:", error);
      return false;
    }
  };

  const handleEdit = (field: "username" | "email") => {
    setEditTarget(field);
    setIsPasswordModalOpen(true);
    setOriginalData(formData);
  };

  const handleChangePasswordClick = () => {
    setEditTarget("password");
    setIsPasswordModalOpen(true);
  };

  const handleCancel = (field: "username" | "email") => {
    if (field === "username") {
      setIsEditingUsername(false);
      setFormData((prev) => ({ ...prev, username: originalData.username }));
    } else {
      setIsEditingEmail(false);
      setFormData((prev) => ({ ...prev, email: originalData.email }));
    }
  };

  const handleUsernameSave = async () => {
    if (!validateUsername(formData.username)) {
      setErrorMessage("Invalid username format...");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await editUsername(formData.username);
      if (response.status === "success") {
        setIsEditingUsername(false);
        setOriginalData(formData);
        setSuccessMessage("Username updated successfully!");
        setIsSuccessModalOpen(true);
      } else {
        setErrorMessage(response.message);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Failed to update username. Please try again.");
      setIsErrorModalOpen(true);
    }
  };

  const handleEmailSave = async () => {
    setIsLoading(true);
    if (!validateEmail(formData.email)) {
      setErrorMessage(
        "Invalid email format. Please enter a valid email address."
      );
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await editEmailRequest(formData.email);
      console.log(response.status);
      if (response.status === "success") {
        setIsEmailVerificationModalOpen(true);
      } else {
        setErrorMessage(response.message);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Failed to update email. Please try again.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailCode = async (code: number, newEmail: string) => {
    try {
      const response = await verifyEmailCode(code, newEmail);
      if (response.status === "success") {
        setIsEmailVerificationModalOpen(false);
        setIsEditingEmail(false);
        setOriginalData((prev) => ({ ...prev, email: newEmail }));
        setSuccessMessage("Email updated successfully!");
        setIsSuccessModalOpen(true);
      } else {
        setErrorMessage(response.message);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Failed to verify code. Please try again.");
      setIsErrorModalOpen(true);
    }
  };

  const handlePasswordChange = async (newPassword: string) => {
    try {
      const response = await changePassword(newPassword);
      if (response.status === "success") {
        setSuccessMessage("Password updated successfully!");
        setIsSuccessModalOpen(true);
      } else {
        setErrorMessage(response.message);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Failed to update password. Please try again.");
      setIsErrorModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    setEditTarget("delete"); // New target for delete confirmation
    setIsPasswordModalOpen(true);
  };

  return (
    <>
      <div className="flex bg-transparent border dark:border-gray-700 rounded-lg w-full h-full relative">
        <aside className="w-64 border-r dark:border-gray-700 bg-stone-100/25 dark:bg-gray-800/40 rounded-l-lg">
          <div className="flex p-4 flex-col gap-1 text-start">
            <h2 className="text-xl font-semibold">Account Settings</h2>
            <p className="text-xs text-gray-500">
              Manage your account information here
            </p>
          </div>
          <nav className="space-y-1 p-2">
            <button
              onClick={() => setActiveSection("profile")}
              className={cn(
                "flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium",
                activeSection === "profile"
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <BoxIcon name="bxs-user-circle" size="16px" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveSection("security")}
              className={cn(
                "flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium",
                activeSection === "security"
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <BoxIcon name="bxs-check-shield" size="16px" />
              <span>Security</span>
            </button>
          </nav>
        </aside>

        <div className="flex-1 overflow-auto px-20 py-4">
          <header className="flex items-center rounded-lg mt-4 mb-4">
            <h1 className="text-2xl font-semibold">
              {activeSection === "profile"
                ? "Profile details"
                : "Security details"}
            </h1>
          </header>
          <Divider className="my-4" />
          <main className="flex items-start justify-center flex-col">
            {activeSection === "profile" ? (
              <>
                <div className="flex flex-col gap-4 w-full">
                  {/* Profile row */}
                  <div className="grid grid-cols-3 items-center justify-start w-full">
                    <span className="text-sm font-semibold text-start">
                      Profile
                    </span>
                    <div className="flex flex-row gap-4 items-center">
                      <Avatar
                        icon={
                          <BoxIcon
                            name="bxs-user"
                            size="20px"
                            className="shadow-2xl"
                          />
                        }
                        size="md"
                        classNames={{
                          base: "bg-gradient-to-br from-violet-500/50 to-fuchsia-500",
                        }}
                        className="transition ease-in-out hover:scale-110 text-white dark:text-black"
                      />
                      <Input
                        isDisabled={!isEditingUsername}
                        isInvalid={!validateUsername(formData.username || "")}
                        variant="underlined"
                        className="w-24"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        classNames={{
                          input: ["text-center", "text-sm", "font-semibold"],
                        }}
                      />
                    </div>
                    <div className="flex gap-2 justify-self-end">
                      {isEditingUsername ? (
                        <>
                          <Button
                            variant="light"
                            color="danger"
                            className="font-medium"
                            onPress={() => handleCancel("username")}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="flat"
                            color="secondary"
                            className="font-medium"
                            isDisabled={!hasChanges("username")}
                            onPress={() => handleUsernameSave()}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="light"
                          color="secondary"
                          className="font-medium"
                          onPress={() => handleEdit("username")}
                        >
                          Edit username
                        </Button>
                      )}
                    </div>
                  </div>
                  <Divider className="my-2" />
                  {/* Email row */}
                  <div className="grid grid-cols-3 items-center justify-start w-full">
                    <span className="text-sm font-semibold text-start">
                      Email address
                    </span>
                    <Input
                      isDisabled={!isEditingEmail}
                      variant="underlined"
                      isInvalid={!validateEmail(formData.email || "")}
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-25"
                      classNames={{
                        input: ["text-xs"],
                      }}
                    />
                    <div className="flex gap-2 justify-self-end">
                      {isEditingEmail ? (
                        <>
                          <Button
                            variant="light"
                            color="danger"
                            className="font-medium"
                            onPress={() => handleCancel("email")}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="flat"
                            color="secondary"
                            className="font-medium"
                            isDisabled={!hasChanges("email")}
                            onClick={() => handleEmailSave()}
                            isLoading={isLoading}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="light"
                          color="secondary"
                          className="font-medium"
                          onPress={() => handleEdit("email")}
                        >
                          Edit email
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-4 w-full">
                  {/* Profile row */}
                  <div className="grid grid-cols-3 items-center justify-start w-full">
                    <span className="text-sm font-semibold text-start">
                      Password
                    </span>
                    <Button
                      variant="bordered"
                      color="secondary"
                      className="text-xs justify-self-center"
                      radius="sm"
                      size="sm"
                      onClick={handleChangePasswordClick}
                    >
                      Change password
                    </Button>
                  </div>
                </div>
                <Divider className="my-2" />
                {/* Delete account row */}
                <div className="grid grid-cols-3 items-center justify-start w-full">
                  <span className="text-sm font-semibold text-start">
                    Delete Account
                  </span>
                  <Button
                    variant="bordered"
                    color="danger"
                    className="text-xs justify-self-center"
                    radius="sm"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete account permanently
                  </Button>
                  <div>{/* Empty space to maintain grid structure */}</div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <ErrorModal
        isOpen={isErrorModalOpen}
        onOpenChange={setIsErrorModalOpen}
        errorMessage={errorMessage}
      />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
      />
      <PasswordConfirmationModal
        isOpen={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        onConfirm={handlePasswordConfirm}
      />
      <EmailVerificationModal
        isOpen={isEmailVerificationModalOpen}
        onOpenChange={setIsEmailVerificationModalOpen}
        onVerify={handleVerifyEmailCode}
        email={formData.email}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onOpenChange={setIsChangePasswordModalOpen}
        onConfirm={handlePasswordChange}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        message={successMessage}
      />
    </>
  );
}
