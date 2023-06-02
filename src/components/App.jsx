import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import AddPlacePopup from "./AddPlacePopup";
import ConfirmActionPopup from './ConfirmActionPopup';
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import InfoPopup from "./InfoPopup";
import Login from "./Login";
import Main from './Main';
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";

import { api } from "../utils/Api";
import { auth } from "../utils/Auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [toBeDeletedCard, setToBeDeletedCard] = useState(false);

  const isOpen =
  isEditProfilePopupOpen ||
  isAddPlacePopupOpen ||
  isEditAvatarPopupOpen ||
  selectedCard ||
  toBeDeletedCard;

  const [currentCard, setCurrentCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [infoMessage, setInfoMessage] = useState(null);

  // Авторизация пользователя
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return;
    Promise.all([
      api.getUserInfo(),
      api.getInitialCards()
    ])
    .then(res => {
      setCurrentUser(res[0]);
      setCards([...res[1]])
    })
    .catch(console.error);
  }, [isLoggedIn]);

  useEffect(() => {
    function closeByEscape(e) {
      if(e.key === 'Escape') {
        closeAllPopups();
      }
    };
    const handleOverlay = (e) => {
        if (e.target.classList.contains('popup_is-opened')) {
            closeAllPopups();
        }
      };

    if (isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      document.addEventListener('mousedown', handleOverlay);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
        document.removeEventListener('mousedown', handleOverlay);
      }
    };
  }, [isOpen])

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setInfoMessage(null);
    setToBeDeletedCard(null);
    setCurrentCard(null);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleShowInfoMessage(message) {
    setInfoMessage(message);
  }

  function handleForCardDelete(id) {
    setCurrentCard(id);
  }

  function handleCardLike(likes, _id) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(_id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === _id ? newCard : c));
      })
      .catch(console.error);
  }

  function handleCardDeletePopup(card) {
    setToBeDeletedCard(card);
  }

  function handleCardDelete(id) {
    api
      .deleteCard(id)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== id));
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleUpdateUser(userInfo) {
    api
      .setUserInfo(userInfo)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleUpdateAvatar(data) {
    api
      .setUserAvatar({link: data.avatar})
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleAddPlaceSubmit(card) {
    api
      .addNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.error);
  }

  // Авторизация
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          navigate("/");
        })
        .catch(console.error);
    }
  }, [navigate]);

  function handleLogin(inputs) {
    auth
      .authorize(inputs)
      .then(res => {
        if (res.token) localStorage.setItem('token', res.token);
        setIsLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        const text = err.message || "Что-то пошло не так! Попробуйте ещё раз.";
        handleShowInfoMessage({
          text: text,
          isSuccess: false,
        });
      });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  function handleRegister(inputs) {
    auth
      .register(inputs)
      .then(() => {
        handleShowInfoMessage({
          text: "Вы успешно зарегистрировались!",
          isSuccess: true,
        });
        navigate("/sign-in");
      })
      .catch((err) => {
        const text = err.message || "Что-то пошло не так! Попробуйте ещё раз.";
        handleShowInfoMessage({
          text: text,
          isSuccess: false,
        });
      });
  }

  return (
    <div className="App">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isLoggiedIn={isLoggedIn}>
                  <Main
                    handleForCardDelete={handleForCardDelete}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDeletePopup}
                    cards={cards}
                    email={email}
                    onLogout={handleLogout}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sign-up"
              element={
                <Register 
                  handleShowInfoMessage={handleShowInfoMessage}
                  onRegister={handleRegister}
                  />
                }
            />
            <Route
              path="/sign-in"
              element={
                <Login
                  handleShowInfoMessage={handleShowInfoMessage}
                  onLogin={handleLogin}
                />
              }
            />
            <Route
              path="*"
              element={
                isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
              }
            />
          </Routes>

          <Footer />
            {/* Редактирования профиля */}
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />
            {/* <!--Обновление аватара--> */}
            <EditAvatarPopup 
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
            {/* <!--Добавления новой карточки--> */}
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />
            {/* Просмотр карточки */}
            <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}
            />
            {/* <!--Удаления карточки--> */}
            <ConfirmActionPopup
              isOpen={toBeDeletedCard}
              onClose={closeAllPopups}
              onConfirm={handleCardDelete}
              currentCard={currentCard} //!10
            />
            <InfoPopup 
              message={infoMessage}
              onClose={closeAllPopups}
            />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;