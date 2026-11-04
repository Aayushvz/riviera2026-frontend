// Modal Component
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-20 flex translate-y-[6%] items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-30 max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[3px_3px_0_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
