import { useEffect, useState } from "react";
import Header from "./Header";
import QuickSelection from "./QuickSelection";
import Overlay from "../../Overlay";
import HistoryCompact from "./HistoryCompact";
import MediaPreview from "./MediaPreview";
import FavoriteCompact from "./FavoriteCompact";

export default function Dashboard({ changeMainComponent }) {
  const [OverlayComponent, setOverlayComponent] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorite, setFavorite] = useState([]);

  const closeOverlay = () => setOverlayComponent(null);
  const setComponent = (Component) =>
    setOverlayComponent({ Component: Component });

  function addMeetingToFavorites(meeting) {
    setFavorite((oldFavorites) => {
      if (oldFavorites) return [...oldFavorites, meeting];
      else return [meeting];
    });
    setHistory((oldHistory) =>
      oldHistory.map((his) => ({
        ...his,
        isMeetingInFavorite:
          his.id === meeting.id ? false : his.isMeetingInFavorite,
      }))
    );
  }

  function removeMeetingFromFavoritesById(id) {
    if (!id) return;
    setFavorite((oldFavorites) => oldFavorites.filter((fav) => fav.id !== id));
    setHistory((oldHistory) =>
      oldHistory.map((his) => ({
        ...his,
        isMeetingInFavorite: his.id === id ? true : his.isMeetingInFavorite,
      }))
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-y-2 relative overflow-auto">
      <Overlay close={closeOverlay} Component={OverlayComponent} />
      <Header />
      <div className="grid grid-flow-row xl:grid-rows-2 grid-rows-1 grid-cols-2 h-full mb-16">
        <article className="block">
          <QuickSelection
            setOverlayComponent={setComponent}
            changeMainComponent={changeMainComponent}
          />
        </article>
        <article className="xl:block hidden">
          <HistoryCompact
            setOverlayComponent={setComponent}
            history={history}
            setHistory={setHistory}
            addMeetingToFavorites={addMeetingToFavorites}
          />
        </article>
        <article className="block">
          <MediaPreview />
        </article>
        <article className="xl:block hidden">
          <FavoriteCompact
            setOverlayComponent={setComponent}
            favorite={favorite}
            setFavorite={setFavorite}
            removeMeetingFromFavoritesById={removeMeetingFromFavoritesById}
          />
        </article>
      </div>
    </div>
  );
}
