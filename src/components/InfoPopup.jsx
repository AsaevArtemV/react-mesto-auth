function InfoPopup({ message, onClose }) {
    function handleOverlayClick(e) {
      if (e.target === e.currentTarget) onClose(e);
    }
  
    return (
      <div
        className={`popup popup_type_info` + (message ? " popup_is-opened" : "")}
        onClick={handleOverlayClick}
      >
        <div className="popup__container">
          <p
            className={
              "popup__info-message" +
              (message
                ? message.isSuccess
                  ? " popup__info-message_type_success"
                  : " popup__info-message_type_fail"
                : "")
            }
          >
            {message ? message.text : " "}
          </p>
  
          <button
            className="popup__close-button"
            type="button"
            aria-label="Закрыть окно"
            onClick={onClose}
          ></button>
        </div>
      </div>
    );
  }
  
  export default InfoPopup;