import { Avatar } from "antd";
import { AvatarSize } from "antd/lib/avatar/SizeContext";
import { FC, useContext, useMemo } from "react";
import { getHashedColor } from "../../lib/color";
import { TeamCtx } from "../reader/Team";

export const UserAvatar: FC<{
  userID: string;
  size?: AvatarSize;
  onClick?: () => void;
  chosen?: boolean;
  className?: string;
}> = ({
  userID,
  size = "default",
  onClick = () => {},
  chosen = false,
  className,
}) => {
  const { userRec } = useContext(TeamCtx);
  const color = useMemo(() => getHashedColor(userID), [userID]);
  const userInfo = userRec[userID];
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
