// components/Modal.js
import React from 'react'

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full">
        <button onClick={onClose} className="text-right">
          Close
        </button>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}
