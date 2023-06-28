import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [error, setError] = useState(false);
  /* Almacenar estado de logueo */
  const [isLogged, setIsLogged] = useState(
    localStorage.getItem('token') ? true : false
  );
  /* Almacenar datos de logueo del usuario */
  const [data, setData] = useState({
    username: '',
    password: '',
  });
  /* Datos recibidos una vez logueado */
  const [books, setBooks] = useState([]);

  /* Funcion para manejar datos desde varios inputs */
  const handleData = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  /* Loguearse para solicitar el token y guardarlo en el localStorage */
  /* Ejemplo con fetch */
  const sendLogin = () => {
    fetch('http://localhost:4000/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 200) {
        setIsLogged(true);
        response.json().then((data) => {
          localStorage.setItem('token', data.accessToken);
        });
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    });
  };

  /* Funcion para desloguearse y limpiar el localstorage */
  const logout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
  };

  /* Peticion para solicitar informacion con la autorizacion en la cabecera */
  /* Ejemplo con axios */
  const getBooks = () => {
    axios
      .get('http://localhost:5000/books', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((data) => setBooks(data.data));
  };

  return (
    <>
      {!isLogged ? (
        <div className="App">
          <header className="App-header">
            Login
            <label htmlFor="username">
              Nombre
              <input
                type="text"
                name="username"
                onChange={handleData}
                value={data.username}
              />
            </label>
            <label htmlFor="password">
              Contraseña
              <input
                type="text"
                name="password"
                onChange={handleData}
                value={data.password}
              />
            </label>
            <button type="submit" onClick={sendLogin}>
              Loguear
            </button>
            {error ? <p className="error">Error: Verifica los datos</p> : null}
          </header>
        </div>
      ) : (
        <div className="App">
          <header className="App-header">
            <p>
              I'm In <span onClick={logout}>Logout</span>
            </p>
            {books.map((book, index) => {
              return (
                <div className="card" key={index}>
                  <p>
                    {book.title} ({book.year})
                  </p>
                  <p>Pages: {book.pages}</p>
                  <p>Language: {book.language}</p>
                  <p>
                    {book.author} ({book.country})
                  </p>
                </div>
              );
            })}
            <button onClick={getBooks}>Cargar libros</button>
          </header>
        </div>
      )}
    </>
  );
}

export default App;
