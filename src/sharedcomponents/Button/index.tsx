import { observer } from "mobx-react";
import { useContextRootStore } from "../../store/store";

const Button = observer(
  ({ name, dataBsToggle, dataBsTarget }: { name: string; dataBsToggle: string; dataBsTarget: string }) => {
    const { buttons, buttonsHandler, getIsAllInputsValid } = useContextRootStore().rootStore;
    const { labelText, disabled, bootStrapColor, modal } = buttons[name];

    const classes = `btn btn-outline-${bootStrapColor}`;

    return (
      <button
        disabled={disabled}
        className={classes}
        id={name}
        name={name}
        onClick={buttonsHandler}
        data-bs-toggle={modal ? (getIsAllInputsValid ? dataBsToggle : "") : dataBsToggle}
        data-bs-target={modal ? (getIsAllInputsValid ? dataBsTarget : "") : dataBsTarget}
      >
        {labelText}
      </button>
    );
  }
);

export default Button;
