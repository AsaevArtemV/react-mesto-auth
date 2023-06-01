import React from 'react';
import PopupWithForm from './PopupWithForm';

function ConfirmActionPopup({ isOpen, onClose, onConfirm, currentCard }) {

  function handleSubmit(e) {
    e.preventDefault();
    onConfirm(currentCard);
  }

  return (
    <PopupWithForm
      name="confirm"
      title="Вы уверены?"
      buttonText="Да"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}

export default ConfirmActionPopup;