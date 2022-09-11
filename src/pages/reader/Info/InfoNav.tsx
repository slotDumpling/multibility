import { Input } from "antd";
import { NoteInfo } from "lib/note/note";
import { FC, useMemo, useState } from "react";
import dayjs from "dayjs";
import calender from "dayjs/plugin/calendar";
dayjs.extend(calender);

export const InfoNav: FC<{
  noteInfo: NoteInfo;
  renameNote: (name: string) => void;
}> = ({ noteInfo, renameNote }) => {
  const [name, setName] = useState(noteInfo.name);
  const { lastTime: lt } = noteInfo;
  const lastDate = useMemo(() => dayjs(lt).calendar(), [lt]);

  return (
    <nav className="info">
      <Input
        className="title"
        size="large"
        bordered={false}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => renameNote(name)}
      />
      <p className="time">{lastDate}</p>
    </nav>
  );
};
