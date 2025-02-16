export default function getBackendUrl() {
    return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  