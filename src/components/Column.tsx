import type { Column as ColumnType, Card as CardType } from "../types";
import { Card } from "./Card";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type ColumnProps = {
  column: ColumnType;
  onCardClick: (card: CardType) => void;
};

export const Column = ({ column, onCardClick }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="column">
      <div className="column__header">
        <span style={{ background: column.color }} className="dot" />
        <h2>{column.title}</h2>
        <span>{column.cards.length}</span>
      </div>

      <SortableContext
        items={column.cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`column__list ${isOver ? "column__list--over" : ""}`}
        >
          {column.cards.map((c: CardType) => (
            <Card key={c.id} card={c} onClick={() => onCardClick(c)} />
          ))}
          {column.cards.length === 0 ? (
            <p className="column__empty">Drop a job here</p>
          ) : null}
        </div>
      </SortableContext>
    </div>
  );
};
