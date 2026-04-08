import type { Card as CardType, Column as ColumnType } from "../types";
import { Column } from "./Column";

type BoardProps = {
  columns: ColumnType[];
  onCardClick: (card: CardType) => void;
};

export const Board = ({ columns, onCardClick }: BoardProps) => {
  return (
    <div className="board">
      {columns.map((col) => (
        <Column key={col.id} column={col} onCardClick={onCardClick} />
      ))}
    </div>
  );
};
