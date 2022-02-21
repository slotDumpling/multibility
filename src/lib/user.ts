import { v4 as getUid } from "uuid";

export interface UserInfo {
  userId: string;
  userName: string;
}

export const getUserId = (() => {
  let cached: string;
  return () => {
    if (cached) return cached;
    let userId = localStorage.getItem("user_id");
    if (!userId) {
      userId = getUid();
      localStorage.setItem("user_id", userId);
    }
    cached = userId;
    return userId;
  };
})();

export const getUserName = () => {
  let name = localStorage.getItem("USER_NAME");
  if (!name) {
    name = "User_" + getUid().slice(0, 8);
    localStorage.setItem("USER_NAME", name);
  }
  return name;
};

export const setUserName = (name: string) => {
  name = name.trim();
  if (!name) return false;
  else localStorage.setItem("USER_NAME", name);
  return true;
};
