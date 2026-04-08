import type { Dispatch, SetStateAction } from "react";

type FormState = {
  title: string;
  company: string;
  link: string;
  contact: string;
  notes: string;
};

type ModalProps = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  onSave: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  onClose: () => void;
};

export const Modal = ({
  form,
  setForm,
  onSave,
  onDelete,
  isEditing = false,
  onClose,
}: ModalProps) => {
  return (
    <div className="modal">
      <div className="modal__content">
        <h3>{isEditing ? "Edit Job" : "Add Job"}</h3>
        <input
          placeholder="Job Title"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <input
          placeholder="Company Name"
          value={form.company}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, company: e.target.value }))
          }
        />
        <input
          placeholder="Job Link"
          value={form.link}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, link: e.target.value }))
          }
        />
        <input
          placeholder="HR Contact"
          value={form.contact}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, contact: e.target.value }))
          }
        />
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, notes: e.target.value }))
          }
        />
        <div className="modal__actions">
          {isEditing ? (
            <button className="btn btn--danger" onClick={onDelete}>
              Delete
            </button>
          ) : null}
          <button className="btn btn--primary" onClick={onSave}>
            {isEditing ? "Update" : "Save"}
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
