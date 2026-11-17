export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || !secret.trim()) {
    throw new Error('JWT_SECRET is not set. Set it in server/.env before starting the server.');
  }
  return secret;
};
