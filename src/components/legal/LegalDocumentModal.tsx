import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import {
  LEGAL_MODAL_BACKDROP,
  LEGAL_MODAL_BODY,
  LEGAL_MODAL_CLOSE_BUTTON,
  LEGAL_MODAL_HEADER,
  LEGAL_MODAL_SHELL,
  LEGAL_MODAL_TITLE,
} from './legalModalStyles'

interface LegalDocumentModalProps {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
}

export default function LegalDocumentModal({
  open,
  title,
  children,
  onClose,
}: LegalDocumentModalProps) {
  const titleId = useId()
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className={LEGAL_MODAL_BACKDROP}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className={LEGAL_MODAL_SHELL}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={LEGAL_MODAL_HEADER}>
          <h2 id={titleId} className={LEGAL_MODAL_TITLE}>
            {title}
          </h2>
          <button
            type="button"
            className={LEGAL_MODAL_CLOSE_BUTTON}
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className={LEGAL_MODAL_BODY}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
