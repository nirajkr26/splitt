import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

export function setupApiAuth(getToken) {
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export async function syncUser() {
  const { data } = await api.post("/auth/sync");
  return data.user;
}

export async function fetchGroups() {
  const { data } = await api.get("/groups");
  return data.groups;
}

export async function createGroup(name) {
  const { data } = await api.post("/groups", { name });
  return data.group;
}

export async function fetchGroup(groupId) {
  const { data } = await api.get(`/groups/${groupId}`);
  return data.group;
}
