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
  const [history, setHistory] = useState([]);
  const [favorite, setFavorite] = useState([]);

  const closeOverlay = () => setOverlayComponent(null);
  const setComponent = (Component) =>
    setOverlayComponent({ Component: Component });

  function addMeetingToFavorites(meeting) {
    console.log("addMeetingTo")
    console.log(meeting)
    setFavorite((oldFavorites) => {
      if (oldFavorites) return [...oldFavorites, meeting]
      else return [meeting]
    });
    setHistory((oldHistory) =>
      oldHistory.map((his) => ({
        ...his,
        isMeetingInFavorite: his.id === meeting.id ? false : his.isMeetingInFavorite
      }))
    );
  }

  function removeMeetingFromFavoritesById(id) {
    if (!id) return;
    setFavorite((oldFavorites) => oldFavorites.filter((fav) => fav.id !== id));
    setHistory((oldHistory) =>
      oldHistory.map((his) => ({
        ...his,
        isMeetingInFavorite: his.id === id ? true : his.isMeetingInFavorite
      }))
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-y-2 relative overflow-hidden">
      <Overlay close={closeOverlay} Component={OverlayComponent} />
      <Header />
      <div className="grid grid-flow-row grid-rows-2 grid-cols-2 h-full">
        <QuickSelection setOverlayComponent={setComponent} changeMainComponent={changeMainComponent} />
        <HistoryCompact setOverlayComponent={setComponent} history={history} setHistory={setHistory} addMeetingToFavorites={addMeetingToFavorites} />
        <MediaPreview />
        <FavoriteCompact setOverlayComponent={setComponent} favorite={favorite} setFavorite={setFavorite} removeMeetingFromFavoritesById={removeMeetingFromFavoritesById} />

      </div>
    </div>
  );
}
