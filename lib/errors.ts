// Turns anything caught in a try/catch into a message that is safe to show the user.
// A TypeError from fetch means the request never reached the server.
export const errorMessage = (
  err: unknown,
  fallback: string,
  offline = 'Cannot reach the MamaCare server. Check your connection and try again.'
): string => {
  if (err instanceof TypeError) return offline;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};
