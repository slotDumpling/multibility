import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface Item {
  id: string;
  content: string;
}

const getItems = (count: number): Item[] =>
  new Array(count).fill(0).map((_, k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function Test() {
  const [items, setItems] = useState(() => getItems(20));

  const onDragEnd = (result: any) => {
    console.log(result);
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {({ droppableProps, innerRef, placeholder }) => (
          <div {...droppableProps} ref={innerRef} style={{
            height: 300,
            overflow: 'scroll',
          }}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {({ innerRef, draggableProps, dragHandleProps }) => (
                  <h1 ref={innerRef} {...draggableProps} {...dragHandleProps}>
                    {item.content}
                  </h1>
                )}
              </Draggable>
            ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
