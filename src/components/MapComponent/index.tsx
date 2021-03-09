import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { useContextRootStore } from "../../store/store";

import styles from "./index.module.css";

const MapComponent = observer(() => {
  const { setYmContainer, getisYmReady } = useContextRootStore().rootStore;
  const ymContainerRef = useRef<HTMLDivElement>(null);

  const fadeOut = (root: HTMLDivElement) => {
    let loadingDiv = root.querySelector("div");
    if (loadingDiv !== null) {
      loadingDiv.style.opacity = "0";
      setTimeout(() => {
        if (loadingDiv) {
          loadingDiv.style.display = "none";
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (ymContainerRef.current) {
      setYmContainer(ymContainerRef.current);
      getisYmReady && fadeOut(ymContainerRef.current);
    }
  });

  return (
    <div
      className="col-12 col-sm-7 col-md-8"
      style={{ position: "relative", minHeight: "60vh" }}
      ref={ymContainerRef}
    >
      <div className={styles.loading}>
        <div className="ps-4 pt-2">
          <h1 className="text-secondary">Загружается карта ...</h1>
        </div>

        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Карта загружется ...</span>
        </div>
      </div>
    </div>
  );
});

export default MapComponent;
