import { useEffect, useState } from "react";
import Header from "./Header";
import QuickSelection from "./QuickSelection";
import Overlay from "../../Overlay";
import HistoryCompact from "./HistoryCompact";
import MediaPreview from "./MediaPreview";
import FavoriteCompact from "./FavoriteCompact";
import useSettings from "../../../stores/settingsStore"
import useVideoSettings from "../../../stores/videoSettingsStore";


export default function Dashboard({ changeMainComponent }) {
  const [OverlayComponent, setOverlayComponent] = useState(null);
  const [isFavoriteClicked, setIsFavoriteClicked] = useState(0);
  const [isRemoveFavoriteClicked, setIsRemoveFavoriteClicked] = useState(0);

  const closeOverlay = () => setOverlayComponent(null);
  const setComponent = (Component) =>
    setOverlayComponent({ Component: Component });


  return (
    <div className="w-full h-full flex flex-col gap-y-2 relative overflow-hidden">
      <Overlay close={closeOverlay} Component={OverlayComponent} />
      <Header />
      <div className="grid grid-flow-row grid-rows-2 grid-cols-2 h-full">
        <QuickSelection setOverlayComponent={setComponent} changeMainComponent={changeMainComponent} />
        <HistoryCompact setOverlayComponent={setComponent} isFavoriteClicked={isFavoriteClicked} setIsFavoriteClicked={setIsFavoriteClicked}
          isRemoveFavoriteClicked={isRemoveFavoriteClicked} />
        <MediaPreview />
        <FavoriteCompact setOverlayComponent={setComponent} isFavoriteClicked={isFavoriteClicked} setIsFavoriteClicked={setIsFavoriteClicked}
          isRemoveFavoriteClicked={isRemoveFavoriteClicked} setIsRemoveFavoriteClicked={setIsRemoveFavoriteClicked} />

      </div>
    </div>
  );
}
