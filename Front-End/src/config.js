const getBaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    const { protocol, hostname } = window.location;
    const port = 7766;

    return `${protocol}//${hostname}:${port}`;
  } else {
    return "https://your-backend-url.com when deploy";
  }
};

export const baseURL = getBaseURL();
