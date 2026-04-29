import { useMemo } from "react";
import { apiClient } from "../services/api";

export default function useApi() {
  return useMemo(() => apiClient, []);
}
