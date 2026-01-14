import React, { useEffect } from "react";

function useEscapeToClose(open, onCancel) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);
}

// PUBLIC_INTERFACE
function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  /** Lightweight confirm dialog modal. */
  useEscapeToClose(open, onCancel);

  if (!open) return null;

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className="ModalOverlay" role="presentation" onMouseDown={onOverlayClick}>
      <div className="Modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="ModalHeader">
          <div className="ModalTitleWrap">
            <h3 className="ModalTitle">{title}</h3>
            <p className="ModalSubtitle">{message}</p>
          </div>
          <button type="button" className="Btn Btn--ghost" onClick={onCancel} aria-label="Close dialog">
            Close
          </button>
        </div>

        <div className="ModalFooter">
          <button type="button" className="Btn" onClick={onCancel}>
            {cancelLabel || "Cancel"}
          </button>
          <button type="button" className="Btn Btn--danger" onClick={onConfirm}>
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
