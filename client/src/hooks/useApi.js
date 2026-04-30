import { useMemo } from "react";
import api from "../services/api.js";

export default function useApi() {
  return useMemo(() => api, []);
}
