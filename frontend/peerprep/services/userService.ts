import { env } from "next-runtime-env";

const USER_SERVICE_URL = env("NEXT_PUBLIC_USER_SERVICE_URL");

//const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const formData = {
    username,
    email,
    password,
    isAdmin: false,
  };

  const response = await fetch(`${USER_SERVICE_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return response;
};

export const loginUser = async (identifier: string, password: string) => {
  const formData = {
    identifier,
    password,
  };
  const response = await fetch(`${USER_SERVICE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return response;
};
