import { FC, useMemo, useState } from "react";
import { Input } from "antd";
import { NoteInfo } from "lib/note/note";
import dayjs from "dayjs";
import calender from "dayjs/plugin/calendar";
dayjs.extend(calender);

export const InfoNav: FC<{
  noteInfo: NoteInfo;
  renameNote: (name: string) => void;
}> = ({ noteInfo, renameNote }) => {
  const [inputShow, setInputShow] = useState(false);
  const [name, setName] = useState(noteInfo.name);

  const [createDateShow, setCreateDateShow] = useState(false);
  const { lastTime: lt, createTime: ct } = noteInfo;
  const lastDate = useMemo(() => dayjs(lt).calendar(), [lt]);
  const createDate = useMemo(() => dayjs(ct).calendar(), [ct]);

  return (
    <nav>
      <div className="info">
        {inputShow ? (
          <Input
            className="title"
            size="large"
            bordered={false}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onBlur={() => {
              renameNote(name);
              setInputShow(false);
            }}
          />
        ) : (
          <p className="title" onClick={() => setInputShow(true)}>
            {name}
          </p>
        )}
        <p className="time" onClick={() => setCreateDateShow((p) => !p)}>
          {createDateShow ? createDate : lastDate}
          <span className="label">
            {createDateShow ? " Created" : " Last Edited"}
          </span>
        </p>
      </div>
    </nav>
  );
};
