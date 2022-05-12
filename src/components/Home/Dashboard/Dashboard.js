import { useState } from "react";
import Header from "./Header";
import QuickSelection from "./QuickSelection";
import Overlay from "../../Overlay";
import HistoryCompact from "./HistoryCompact";
import MediaPreview from "./MediaPreview";
import FavoriteCompact from "./FavoriteCompact";

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
        <HistoryCompact setOverlayComponent={setComponent} />
        <MediaPreview />
        <FavoriteCompact setOverlayComponent={setComponent} />

      </div>
    </div>
  );
}
