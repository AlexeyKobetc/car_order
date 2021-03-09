import { action, computed, makeObservable, observable } from "mobx";
import { buttons } from "../sharedcomponents/initComponents";

class ButtonsStore {
  buttonsStore = buttons;
  constructor() {
    makeObservable(this, {
      buttonsStore: observable,
      setButtonsDisabled: action,
      getButtons: computed
    });
  }

  get getButtons() {
    return this.buttonsStore;
  }

  setButtonsDisabled = (buttonName: string, isDisabled: boolean) => {
    this.buttonsStore[buttonName].disabled = isDisabled;
  };
}

export default ButtonsStore;
