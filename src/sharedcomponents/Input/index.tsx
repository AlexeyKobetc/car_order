import { observer } from "mobx-react";
import { useContextRootStore } from "../../store/store";

const Input = observer(({ name }: { name: string }) => {
  const { inputs, inputsHandler } = useContextRootStore().rootStore;
  const { textarea, labelText, placeHolder, errorLabel, value, isValid } = inputs[name];

  return (
    <div className="form-floating">
      {textarea ? (
        <textarea
          className={
            "form-control bg-secondary bg-light border-dark text-dark" +
            (isValid !== null ? (isValid ? " is-valid " : " is-invalid ") : "")
          }
          style={{ height: "6rem" }}
          id={name}
          name={name}
          placeholder={placeHolder}
          value={value}
          onFocus={inputsHandler}
          onBlur={inputsHandler}
          onChange={inputsHandler}
        />
      ) : (
        <input
          className={
            "form-control bg-secondary bg-light border-dark text-dark" +
            (isValid !== null ? (isValid ? " is-valid " : " is-invalid ") : "")
          }
          type="text"
          id={name}
          name={name}
          placeholder={placeHolder}
          value={value}
          onFocus={inputsHandler}
          onBlur={inputsHandler}
          onChange={inputsHandler}
        />
      )}

      <label htmlFor={name} className={`form-label ${isValid === false ? "text-danger" : "text-secondary"}`}>
        {/* {labelText} */}
        {isValid === false ? <strong>{isValid === false && errorLabel}</strong> : labelText}
      </label>
    </div>
  );
});

export default Input;
