import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";

function Register({ onRegister }) {
  const defaultValues = {
    email: "",
    password: "",
  };

  const [inputs, setInputs] = useState(defaultValues);

  function handleChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    setInputs((state) => ({ ...state, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(inputs);
    resetForm();
  }

  function resetForm() {
    setInputs({ ...defaultValues });
  }

  return (
    <>
      <Header>
        <Link to="/sign-in" className="header__menu-item">
          Войти
        </Link>
      </Header>

      <main>
        <div className="login">
          <h2 className="login__title">Регистрация</h2>
          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              className="login__input"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              minLength='6'
              maxLength='40'
              required
            />
            <input
              type="password"
              className="login__input"
              placeholder="Пароль"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              minLength='6'
              maxLength='40'
              required
            />
            <button rype="submit" className="login__save-button">
              Зарегистрироваться
            </button>
          </form>
          <p className="login__question-text">
            Уже зарегистрированы?{" "}
            <Link className="login__link" to="/sign-in">
              Войти
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default Register;