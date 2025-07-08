export const getSecretKey = (): string => {
  const secretKey = Deno.env.get("SECRET_KEY");
  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined in the environment variables");
  }
  return secretKey;
};

export const getSalt = (): string => {
  const salt = Deno.env.get("ARGON2_SALT");
  if (!salt) {
    throw new Error("ARGON2_SALT is not defined in the environment variables");
  }
  return salt;
}
