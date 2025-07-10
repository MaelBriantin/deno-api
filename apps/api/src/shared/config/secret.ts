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
};

export const getRefreshTokenDuration = (): number => {
  const duration = Deno.env.get("REFRESH_TOKEN_DURATION");
  if (!duration) {
    throw new Error(
      "REFRESH_TOKEN_DURATION is not defined in the environment variables",
    );
  }
  const parsedDuration = parseInt(duration, 10);
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    throw new Error(
      "REFRESH_TOKEN_DURATION must be a positive integer (in seconds)",
    );
  }
  return parsedDuration;
};

export const getBearerTokenDuration = (): number => {
  const duration = Deno.env.get("BEARER_TOKEN_DURATION");
  if (!duration) {
    throw new Error(
      "BEARER_TOKEN_DURATION is not defined in the environment variables",
    );
  }
  const parsedDuration = parseInt(duration, 10);
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    throw new Error("BEARER_TOKEN_DURATION must be a positive integer");
  }
  return parsedDuration;
};
