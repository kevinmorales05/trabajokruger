import "./App.css";
import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";
import moment from "moment";
import "moment/locale/es";

function App() {
  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState("");
  const activarEdicion = (item) => {
    setModoEdicion(true);
    setTarea(item.name);
    setId(item.id);
  };

  const agregar = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      alert("Escriba la actividad!");
      return;
    }

    try {
      const db = firebase.firestore();
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };
      const data = await db.collection("tareas").add({
        name: tarea,
        fecha: Date.now(),
      });
      setTareas([...tareas, { id: data.id, ...nuevaTarea }]);
      setTarea("");
    } catch (error) {
      console.log(error);
    }
  };//Agregar actividad

  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("tareas").doc(id).delete();
      const arrayFiltrado = tareas.filter((task) => task.id !== id);
      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };//eliminar actividad
  const editar = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      console.log("vacio");
      return;
    }
    try {
      const db = firebase.firestore();
      await db.collection("tareas").doc(id).update({
        name: tarea,
      });
      const arrayEditado = tareas.map((item) =>
        item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : item
      );
      setTareas(arrayEditado);
      setModoEdicion(false);
      setId("");
      setTarea("");
    } catch (error) {
      console.log(error);
    }
  };//editar actividad

  useEffect(() => {
    const getData = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("tareas").get();
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTareas(arrayData);
      } catch (error) {
        console.log("there is no database!");
      }
    };
    getData();
  }, []);
  return (
    <div className="container">
      <div className="fixedBlock container">
      <hr></hr>
        <h1 className="text-center mt-4 title fw-bolder">Lista de Tareas</h1>
        <h3>{modoEdicion ? "Editar Tarea" : "Agregar Tarea Nueva"}</h3>
        <form onSubmit={modoEdicion ? editar : agregar}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Ingrese Tarea"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
          />
          <button
            type="submit"
            className={
              modoEdicion
                ? "btn btn-warning btn-block btn-sm"
                : "btn btn-dark btn-block btn-sm"
            }
          >
            {modoEdicion ? "Editar" : "Agregar"}
          </button>
        </form>
        <hr></hr>
      </div>

      <ul className="container d-inline-flex flex-wrap justify-content-center fixedList">
        {tareas.map((tarea) => {
          return (
            <div className="activityBox">
              <p className="fw-bolder textActivity">{tarea.name}</p>
              <p className="fw-light textActivity">
                {moment(tarea.fecha).format("LL")}
              </p>
              <p className="fw-bold textActivity">
                {moment(tarea.fecha).format("LT")}
              </p>
              <button
                className="btn btnDelete btn-sm float-right"
                onClick={() => eliminar(tarea.id)}
              >
                Eliminar
              </button>
              <button
                className="btn btnEdit btn-sm float-right mr-2"
                onClick={() => activarEdicion(tarea)}
              >
                Editar
              </button>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
