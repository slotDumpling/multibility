import { v4 as getUid } from "uuid";

export interface UserInfo {
  userID: string;
  userName: string;
  online: boolean;
}

export const getUserID = (() => {
  let cached: string;
  return () => {
    if (cached) return cached;
    let userID = localStorage.getItem("USER_ID");
    if (!userID) {
      userID = getUid();
      localStorage.setItem("USER_ID", userID);
    }
    cached = userID;
    return userID;
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
