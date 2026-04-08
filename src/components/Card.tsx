import type { Card as CardType } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const CardBody = ({
  card,
  onDetailsClick,
  showDetailsButton = true,
}: {
  card: CardType;
  onDetailsClick?: () => void;
  showDetailsButton?: boolean;
}) => {
  return (
    <>
      <div className="card__top">
        <small>{card.company}</small>
        {showDetailsButton ? (
          <button
            type="button"
            className="card__detail-btn"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              onDetailsClick?.();
            }}
          >
            Details
          </button>
        ) : null}
      </div>
      <h4>{card.title}</h4>
      <a
        href={card.link}
        target="_blank"
        rel="noreferrer noopener"
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
          onDetailsClick?.();
        }}
      >
        Open Job Link
      </a>
      <p>{card.contact || "No HR contact"}</p>
      <span>{card.notes || "No notes"}</span>
    </>
  );
};

const SortableCard = ({
  card,
  onDetailsClick,
}: {
  card: CardType;
  onDetailsClick?: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? "card--dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CardBody
        card={card}
        onDetailsClick={isDragging ? undefined : onDetailsClick}
      />
    </div>
  );
};

export const Card = ({
  card,
  isOverlay = false,
  onClick,
}: {
  card: CardType;
  isOverlay?: boolean;
  onClick?: () => void;
}) => {
  if (isOverlay) {
    return (
      <div className="card card--overlay">
        <CardBody card={card} showDetailsButton={false} />
      </div>
    );
  }

  return <SortableCard card={card} onDetailsClick={onClick} />;
};
