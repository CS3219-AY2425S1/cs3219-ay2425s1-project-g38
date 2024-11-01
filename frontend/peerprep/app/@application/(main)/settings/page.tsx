"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import BoxIcon from "@/components/boxicons";
import { Avatar, Button, Divider, Input } from "@nextui-org/react";
import { validateEmail, validateUsername } from "@/utils/utils";
import { ErrorModal } from "@/components/errormodal";

export default function SettingsPage() {
  // Get initial data from the embedded script
  const initialData = React.useMemo(() => {
    if (typeof window === "undefined") return { username: "", email: "" };
    const script = document.getElementById("user-data");
    if (script) {
      return JSON.parse(script.innerHTML);
    }
    return { username: "", email: "" };
  }, []);

  const [formData, setFormData] = React.useState({
    username: initialData.username || "username",
    email: initialData.email || "email@email.com",
  });

  const [activeSection, setActiveSection] = React.useState("profile");
  const [isEditing, setIsEditing] = React.useState(false);
  const [originalData, setOriginalData] = React.useState(formData);
  const [isErrorModalOpen, setIsErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData(formData);
  };

  const handleSave = () => {
    // Validate inputs before saving
    if (!validateUsername(formData.username || "username")) {
      setErrorMessage(
        "Invalid username format. Username must be 3-20 characters long and contain only letters, numbers, and underscores."
      );
      setIsErrorModalOpen(true);
      return;
    }

    if (!validateEmail(formData.email || "example@email.com")) {
      setErrorMessage(
        "Invalid email format. Please enter a valid email address."
      );
      setIsErrorModalOpen(true);
      return;
    }

    setIsEditing(false);
    setOriginalData(formData);
    // Here you would typically make an API call to save the changes
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(originalData);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
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
                        isDisabled={!isEditing}
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
                    <Button
                      variant="light"
                      color="secondary"
                      className="font-medium justify-self-end"
                      onPress={!isEditing ? handleEdit : handleCancel}
                    >
                      {!isEditing ? "Edit profile" : "Cancel"}
                    </Button>
                  </div>
                  <Divider className="my-2" />
                  {/* Email row */}
                  <div className="grid grid-cols-3 items-center justify-start w-full">
                    <span className="text-sm font-semibold text-start">
                      Email address
                    </span>
                    <Input
                      isDisabled={!isEditing}
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
                    <div>{/* Empty space to maintain grid structure */}</div>
                  </div>
                </div>
                {isEditing && (
                  <div className="absolute bottom-4 right-4">
                    <Button
                      color="secondary"
                      variant="flat"
                      isDisabled={!hasChanges}
                      onPress={handleSave}
                    >
                      Save
                    </Button>
                  </div>
                )}
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
                      className="text-xs justify-self-end"
                      radius="sm"
                      size="sm"
                    >
                      Change password
                    </Button>
                  </div>
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
    </>
  );
}
