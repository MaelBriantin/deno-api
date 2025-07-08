export const getSecretKey = (): string => {
  const secretKey = Deno.env.get("SECRET_KEY");
  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined in the environment variables");
  }
  return secretKey;
};
