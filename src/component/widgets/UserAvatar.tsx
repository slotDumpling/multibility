import { Avatar } from "antd";
import { AvatarSize } from "antd/lib/avatar/SizeContext";
import { FC, useMemo } from "react";
import { getHashedColor } from "lib/color";
import { UserInfo } from "lib/user";

export const UserAvatar: FC<{
  userInfo: UserInfo;
  size?: AvatarSize;
  onClick?: () => void;
  chosen?: boolean;
  className?: string;
}> = ({
  userInfo,
  size = "default",
  onClick = () => {},
  chosen = false,
  className,
}) => {
  const color = useMemo(() => getHashedColor(userInfo.userID), [userInfo]);
  if (!userInfo) return null;
  const { userName } = userInfo;

  return (
    <Avatar
      className={className}
      data-chosen={chosen}
      size={size}
      style={{ backgroundColor: color }}
    >
      <div className="avatar-wrapper" onClick={onClick}>
        {userName?.slice(0, 3)}
      </div>
    </Avatar>
  );
};
