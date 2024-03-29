import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";
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
    name = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      style: "capital",
    });
    localStorage.setItem("USER_NAME", name);
  }
  return name;
};

export const saveUserName = (name: string) => {
  name = name.trim();
  if (!name) return false;
  else localStorage.setItem("USER_NAME", name);
  return true;
};
