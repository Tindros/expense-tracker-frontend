import { useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmation({ isOpen, onConfirm, onCancel, isDeleting }: Props) {
  // Move initial focus to the Cancel button when the dialog opens
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Small timeout lets the DOM become visible before focusing
      const id = setTimeout(() => cancelRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    /*
     * role="dialog" + aria-modal="true" communicate dialog semantics to
     * screen readers. aria-labelledby ties the visible heading to the dialog.
     *
     * NOTE: Full focus trapping (keeping Tab inside the modal) would require
     * a more involved implementation. As discussed in the maintenance brief,
     * that scope is deferred. The Cancel button receives focus on open, and
     * the Escape key is not wired here — both are documented limitations.
     */
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="modal-content">
        <h3 id="delete-dialog-title">Delete Expense</h3>
        <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
        <div className="modal-actions">
          <button
            ref={cancelRef}
            className="btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
