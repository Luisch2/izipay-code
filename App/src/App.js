import { useState } from "react";
import KRGlue from "@lyracom/embedded-form-glue";
import axios from "axios";
import PaymentForm from "./components/PaymentForm";

function App() {
  const [isShow, setIsShow] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("PEN"); // Estado para manejar la moneda seleccionada
  const [error, setError] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false); // Nuevo estado para controlar el pop-up

  const publicKey = "~~CHANGE_ME_PUBLIC_KEY~~";
  const endPoint = "~~CHANGE_ME_ENDPOINT~~";
  const formToken = "~~DEMO_TOKEN-TO-BE-REPLACED~~";
  const server = "http://your_server.com";

  const payment = () => {
    const ExpRegSoloNumeros = "^[0-9]+$";
    if (amount.match(ExpRegSoloNumeros) != null) {
      // Obtener el formToken
      getFormToken(amount, publicKey, endPoint);
      setIsShow(true);
    } else {
      setIsValid(false);
      setTimeout(() => setIsValid(true), 3000);
    }
  };

  const getFormToken = (monto, publicKey, domain) => {
    const dataPayment = {
      amount: monto * 100,
      currency: currency, // Utiliza la moneda seleccionada
      customer: {
        email: "example@gmail.com",
      },
      orderId: "pedido-0",
    };
    // axios.post(`${server}/api/createPayment`,dataPayment)
    // .then(({data}) => {
    KRGlue.loadLibrary(domain, publicKey)
      .then(({ KR }) =>
        KR.setFormConfig({
          formToken: formToken,
          // formToken:data.formToken,
        })
      )
      .then(({ KR }) => KR.onSubmit(validatePayment))
      .then(({ KR }) => KR.attachForm("#form"))
      .then(({ KR, result }) => KR.showForm(result.formId))
      // })
      .catch((err) =>console.log(err));
  };

  const validatePayment = (resp) => {
    axios.post(`${server}/api/validatePayment`, resp).then(({ data }) => {
      if (data === "Valid Payment") {
        setIsShow(false);
        setIsPopUpOpen(false); // Cierra el pop-up después del pago
        alert("Pago Satisfactorio");
      } else {
        alert("Pago Inválido");
      }
    });
    return false;
  };

  return (
    <div className="container">
      <main>
        <div className="py-5 text-center">
          <h3>Ejemplo de un formulario incrustado con React</h3>
          <div
            className="alert alert-danger align-items-center"
            role="alert"
            style={{ display: error !== "" ? "flex" : "none" }}
          >
            <svg
              className="bi flex-shrink-0 me-2"
              width="24"
              height="24"
              role="img"
              aria-label="Danger:"
            >
              <use xlinkHref="#exclamation-triangle-fill" />
            </svg>
            <div>{error}</div>
          </div>
        </div>

        {/* Botón para abrir el Pop-up */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-8"
          onClick={() => setIsPopUpOpen(true)} // Abre el pop-up
        >
          Abrir Pop-up
        </button>

        {/* Condicional para mostrar el Pop-up */}
        {isPopUpOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto relative"> {/* Cambiado max-w-md a max-w-xl para hacerlo más ancho */}
              <button
                className="absolute top-2 right-2 text-black text-lg"
                onClick={() => setIsPopUpOpen(false)} // Cierra el pop-up
              >
                &times;
              </button>
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-4">Formulario Popin</h4>
              </div>
              <hr className="my-4" />
              <div className="flex justify-center">
                <div
                  id="myDIV"
                  className="formulario"
                  style={{ display: isShow ? "block" : "none" }}
                >
                  <div id="form">
                    {/* Formulario de pago POPIN */}
                    <PaymentForm popin={true} />
                  </div>
                </div>
              </div>
              <hr className="my-4" />

              <form className="needs-validation">
                <div className="flex flex-col space-y-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">
                      Monto Total
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setAmount(e.target.value)}
                      value={amount}
                      placeholder="S/."
                      required
                    />
                    <div
                      className="invalid-feedback"
                      style={{ display: isValid ? "none" : "block" }}
                    >
                      Ingrese un monto válido.
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="form-label">
                      Moneda
                    </label>
                    <div className="relative">
                      <select
                        className="form-control appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)} // Maneja la selección de moneda
                      >
                        <option value="PEN">PEN</option>
                        <option value="USD">USD</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M5.516 7.548L10 12.032l4.484-4.484a.75.75 0 0 1 1.061 1.061l-5 5a.75.75 0 0 1-1.061 0l-5-5a.75.75 0 0 1 1.061-1.061z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <button
                  onClick={payment}
                  className="bg-yellow-500 text-black font-bold py-2 px-4 rounded w-full"
                  type="button"
                >
                  Finalizar con el Pago
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
