
import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable({id, children} : {id:string, children:React.ReactNode}) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    animation: isOver ? "tilt-n-move-shaking 0.83s infinite":"none",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
  