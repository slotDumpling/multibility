import { Button, ButtonProps, Dropdown, Input, Menu, Popconfirm } from "antd";
import { FC, useContext } from "react";
import { MenuMethodCtx, MenuStateCtx } from "./MainMenu";
import {
  SwapOutlined,
  TagsOutlined,
  FileOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
  RollbackOutlined,
  CheckSquareOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { Setter } from "../../lib/hooks";
import { ColorCirle } from "../widgets/ColorCircle";
import classNames from "classnames";

export function HeadTools({
  sortType,
  setSortType,
  searchText,
  setSearchText,
  onDelete,
  onMove,
  disabled = true,
}: {
  sortType: string;
  setSortType: Setter<string>;
  searchText: string;
  setSearchText: Setter<string>;
  onDelete: () => void;
  onMove: (tagID: string) => void;
  disabled: boolean;
}) {
  const { editing, allTags } = useContext(MenuStateCtx);
  const { setEditing } = useContext(MenuMethodCtx);

  const sortMenu = (
    <Menu
      onClick={({ key }) => setSortType(key)}
      selectedKeys={[sortType]}
      className="sort-drop"
      items={[
        {
          type: "group",
          label: "Sort by",
          children: [
            { icon: <FileOutlined />, key: "CREATE", label: "Date created" },
            { icon: <FileTextOutlined />, key: "LAST", label: "Date modified" },
            { icon: <SortAscendingOutlined />, key: "NAME", label: "Name" },
          ],
        },
      ]}
    />
  );

  const btnProps: ButtonProps = { type: "text", shape: "circle" };
  const sortButton = (
    <Dropdown overlay={sortMenu} trigger={["click"]} placement="bottom">
      <Button
        className="sort-btn"
        icon={<SwapOutlined rotate={90} />}
        {...btnProps}
      />
    </Dropdown>
  );

  const deleteButton = (
    <Popconfirm
      title="Notes will be deleted."
      onConfirm={onDelete}
      icon={<DeleteOutlined />}
      placement="bottom"
      cancelText="Cancel"
      disabled={disabled}
      okText="Delete"
      okType="danger"
      okButtonProps={{ type: "primary" }}
    >
      <Button
        className="del-btn"
        shape="round"
        type="text"
        disabled={disabled}
        danger={!disabled}
        icon={<DeleteOutlined />}
      >
        Delete
      </Button>
    </Popconfirm>
  );

  const ColorLabel: FC<{
    color: string;
    name: string;
  }> = ({ color, name }) => (
    <div className="tag-select">
      <ColorCirle color={color} className="tag-circle" />
      <span className="name">{name}</span>
    </div>
  );

  const overlay = (
    <Menu
      onClick={({ key }) => onMove(key)}
      items={[
        {
          key: "DEFAULT",
          label: <ColorLabel color="#eee" name="No tag" />,
        },
        ...Object.values(allTags).map((t) => ({
          key: t.uid,
          label: <ColorLabel color={t.color} name={t.name} />,
        })),
      ]}
    />
  );

  const tagButton = (
    <Dropdown
      disabled={disabled}
      overlay={overlay}
      trigger={["click"]}
      placement="bottom"
    >
      <Button
        shape="round"
        type="text"
        className="tag-btn"
        icon={<TagsOutlined />}
        style={{ transition: "none" }}
      >
        Tag
      </Button>
    </Dropdown>
  );

  return (
    <div className={classNames("head-tools", { editing })}>
      {editing ? (
        <>
          <Button
            className="small"
            onClick={() => setEditing(false)}
            icon={<RollbackOutlined />}
            {...btnProps}
          />
          {tagButton}
          {deleteButton}
        </>
      ) : (
        <>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
            prefix={<SearchOutlined />}
            bordered={false}
            allowClear
          />
          {sortButton}
          <Button
            className="small"
            onClick={() => setEditing(true)}
            icon={<CheckSquareOutlined />}
            {...btnProps}
          />
        </>
      )}
    </div>
  );
}
