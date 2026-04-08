import { useMemo, useState } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { JobCard, Column } from "./types";
import { Board } from "./components/Board";
import { Card } from "./components/Card";
import { Modal } from "./components/Modal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./styles/main.scss";

const uid = () => Math.random().toString(36).slice(2);

const initial: Column[] = [
  { id: "applied", title: "Applied", color: "#d0e2ff", cards: [] },
  { id: "contacted", title: "Contacted", color: "#3b82f6", cards: [] },
  { id: "interview", title: "Interview", color: "#f59e0b", cards: [] },
  { id: "rejected", title: "Rejected", color: "#ef4444", cards: [] },
  { id: "offer", title: "Offer", color: "#22c55e", cards: [] },
];

type FormState = {
  title: string;
  company: string;
  link: string;
  contact: string;
  notes: string;
};

const emptyForm: FormState = {
  title: "",
  company: "",
  link: "",
  contact: "",
  notes: "",
};

export default function App() {
  const [columns, setColumns] = useLocalStorage<Column[]>(
    "job-tracker-columns",
    initial,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [activeCard, setActiveCard] = useState<JobCard | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const findColumnByCardId = (cardId: string) => {
    return columns.find((col) => col.cards.some((card) => card.id === cardId));
  };

  const activeJobsCount = useMemo(() => {
    return columns
      .filter((column) => column.id !== "rejected")
      .reduce((sum, column) => sum + column.cards.length, 0);
  }, [columns]);

  const offerCount = useMemo(() => {
    const offerColumn = columns.find((column) => column.id === "offer");
    return offerColumn ? offerColumn.cards.length : 0;
  }, [columns]);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingCardId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (card: JobCard) => {
    setForm({
      title: card.title,
      company: card.company,
      link: card.link,
      contact: card.contact,
      notes: card.notes,
    });
    setEditingCardId(card.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCardId(null);
    setForm(emptyForm);
  };

  const saveCard = () => {
    if (!form.title.trim() || !form.company.trim()) {
      return;
    }

    if (editingCardId) {
      setColumns((prev) =>
        prev.map((column) => ({
          ...column,
          cards: column.cards.map((card) =>
            card.id === editingCardId
              ? {
                  ...card,
                  title: form.title.trim(),
                  company: form.company.trim(),
                  link: form.link.trim() || "#",
                  contact: form.contact.trim(),
                  notes: form.notes.trim(),
                }
              : card,
          ),
        })),
      );
    } else {
      const newCard: JobCard = {
        id: uid(),
        title: form.title.trim(),
        company: form.company.trim(),
        link: form.link.trim() || "#",
        contact: form.contact.trim(),
        notes: form.notes.trim(),
      };

      setColumns((prev) =>
        prev.map((column) =>
          column.id === "applied"
            ? { ...column, cards: [...column.cards, newCard] }
            : column,
        ),
      );
    }

    closeModal();
  };

  const deleteCard = () => {
    if (!editingCardId) return;

    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== editingCardId),
      })),
    );

    closeModal();
  };

  const handleDragStart = (event: DragStartEvent) => {
    const movingCard = columns
      .flatMap((column) => column.cards)
      .find((card) => card.id === String(event.active.id));

    setActiveCard(movingCard || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const fromCol = findColumnByCardId(activeId);
    if (!fromCol) return;

    const overIsColumn = columns.some((column) => column.id === overId);
    const toCol = overIsColumn
      ? columns.find((column) => column.id === overId)
      : findColumnByCardId(overId);

    if (!fromCol || !toCol) return;

    const oldIndex = fromCol.cards.findIndex((card) => card.id === activeId);
    if (oldIndex < 0) return;

    if (fromCol.id === toCol.id) {
      const newIndex = overIsColumn
        ? toCol.cards.length - 1
        : toCol.cards.findIndex((card) => card.id === overId);

      if (newIndex < 0 || oldIndex === newIndex) return;

      setColumns((prev) =>
        prev.map((column) =>
          column.id === fromCol.id
            ? { ...column, cards: arrayMove(column.cards, oldIndex, newIndex) }
            : column,
        ),
      );
    } else {
      const movingCard = fromCol.cards[oldIndex];
      if (!movingCard) return;

      setColumns((prev) =>
        prev.map((column) => {
          if (column.id === fromCol.id) {
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== activeId),
            };
          }

          if (column.id === toCol.id) {
            const insertIndex = overIsColumn
              ? column.cards.length
              : Math.max(
                  0,
                  column.cards.findIndex((card) => card.id === overId),
                );

            const nextCards = [...column.cards];
            nextCards.splice(insertIndex, 0, movingCard);

            return { ...column, cards: nextCards };
          }

          return column;
        }),
      );
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Job Tracker</h1>
          <p className="subtitle">
            Track applications from first outreach to final decision.
          </p>
        </div>

        <div className="header__right">
          <div className="stats">
            <div className="stat">
              <span>Active</span>
              <strong>{activeJobsCount}</strong>
            </div>
            <div className="stat">
              <span>Offers</span>
              <strong>{offerCount}</strong>
            </div>
          </div>
          <button className="add-btn" onClick={openAddModal}>
            + Add Job
          </button>
        </div>
      </header>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Board columns={columns} onCardClick={openEditModal} />
        <DragOverlay>
          {activeCard ? <Card card={activeCard} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {isModalOpen ? (
        <Modal
          form={form}
          setForm={setForm}
          onSave={saveCard}
          onDelete={deleteCard}
          isEditing={Boolean(editingCardId)}
          onClose={closeModal}
        />
      ) : null}
    </div>
  );
}
