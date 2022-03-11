import { useState } from "react";
import Header from "./Header";
import QuickSelection from "./QuickSelection";
import Overlay from "../../Overlay";

export default function Dashboard() {
  const [OverlayComponent, setOverlayComponent] = useState(null);

  const closeOverlay = () => setOverlayComponent(null);
  const setComponent = (Component) =>
    setOverlayComponent({ Component: Component });

  return (
    <div className="w-full h-full flex flex-col gap-y-2 relative overflow-hidden">
      <Overlay close={closeOverlay} Component={OverlayComponent} />
      <Header />
      <div className="grid grid-flow-row grid-rows-2 grid-cols-2 h-full">
        <QuickSelection setOverlayComponent={setComponent} />
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
    </div>
  );
}
