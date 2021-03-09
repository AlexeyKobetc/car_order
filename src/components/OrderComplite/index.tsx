import { observer } from "mobx-react";
import { useContextRootStore } from "../../store/store";

const OrderComplite = observer(() => {
  const { getOrderData } = useContextRootStore().rootStore;
  return (
    <div
      className="modal fade"
      id="modal_order"
      tabIndex={-1}
      aria-labelledby="orderLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header" data-bs-dismiss="modal">
            <h5 className="modal-title" id="orderLabel">
              Заказ сформирован.
            </h5>
          </div>
          <div className="modal-body" data-bs-dismiss="modal">
            <ul>
              <li>
                <p>
                  Номер заказа:<strong>{getOrderData.orderId}</strong>
                </p>
              </li>
              <li>
                <p>
                  Время заказа:<strong>{getOrderData.orderTime}</strong>
                </p>
              </li>
              <li>
                <p>
                  Имя клиента:<strong>{getOrderData.clientName}</strong>
                </p>
              </li>
              <li>
                <p>
                  Контакты клиента:<strong>{getOrderData.clientContacts}</strong>
                </p>
              </li>
              <li>
                <p>
                  Адрес отправления:<strong>{getOrderData.sourceAddress}</strong>
                </p>
              </li>
              <li>
                <p>
                  Адрес назначения:<strong>{getOrderData.destinationAddress}</strong>
                </p>
              </li>
              <li>
                <p>
                  Выбранный автомобиль:
                  <strong>{`${getOrderData.selectDriver.car_mark} ${getOrderData.selectDriver.car_model} ${getOrderData.selectDriver.car_color}, госномер: ${getOrderData.selectDriver.car_number}`}</strong>
                </p>
              </li>
              <li>
                <p>
                  Водитель:
                  <strong>{`${getOrderData.selectDriver.driver_name}, телефон: ${getOrderData.selectDriver.driver_phone}`}</strong>
                </p>
              </li>
            </ul>
          </div>
          <div className="modal-footer">
            <div>{JSON.stringify(getOrderData)}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrderComplite;
