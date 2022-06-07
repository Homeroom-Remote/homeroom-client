import { useEffect, useState } from "react";
import {
  getMeetingHistory,
  get,
  handleAddToFavorite,
  isMeetingInFavorite,
} from "../../../api/meeting";
import NoHistorySVG from "../../../utils/tissue.svg";
import LoadingSVG from "../../../utils/seo.svg";
import useMeeting from "../../../stores/meetingStore";
import usePopup from "../../../stores/popupStore";

import Button from "../../Button";
import StarButton from "../../StarButton";

function NoHistoryComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div className="flex flex-col max-h-full items-center justify-center">
        <h1 className="text-4xl font-medium text-primary-400">No History.</h1>
        <object data={NoHistorySVG} type="image/svg+xml">
          <img src="" alt="no history" />
        </object>
      </div>
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex w-1/2 h-1/2 items-center justify-center">
        <object data={LoadingSVG} type="image/svg+xml">
          <img src="" alt="loading" />
        </object>
      </div>
    </div>
  );
}

function HistoryComponent({ history, addMeetingToFavorites }) {
  const { joinMeeting } = useMeeting();
  const { setShow, setOpts } = usePopup();
  const styles = {
    head_th:
      "px-6 align-middle border border-solid py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left dark:bg-dark-800 dark:text-text-200 dark:border-dark-700 bg-lt-400 text-text-200 border-lt-200",
    body_td:
      "border-t-0 text-lg px-6 py-2 align-middle border-l-0 border-r-0 whitespace-nowrap relative ",
  };

  const handleJoinMeeting = (meeting) => {
    if (meeting.status === "online") {
      joinMeeting(meeting.id);
    } else {
      setOpts({
        title: "Meeting Offline",
        body: "Can not join meeting right now, try again later.",
        type: "error",
      });
      setShow(true);
    }
  };

  return (
    <>
      <div className=" overflow-auto">
        <table className="items-center w-full bg-transparent border-collapse table-auto">
          <thead>
            <tr>
              <th className={styles.head_th}>Owner</th>
              <th className={styles.head_th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((meeting, index) => (
              <tr key={`meeting-${meeting.id}-${index}`}>
                <td className={styles.body_td + "border-r"}>
                  {meeting.owner_name}
                </td>
                <td
                  className={
                    styles.body_td + "flex items-center justify-between"
                  }
                >
                  <Button
                    text="Join"
                    onClick={() => handleJoinMeeting(meeting)}
                  />
                  {meeting.isMeetingInFavorite === true && (
                    <StarButton
                      text="Fav"
                      onClick={() => {
                        addMeetingToFavorites(meeting);
                        handleAddToFavorite(meeting).then((data) => {});
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default function HistoryCompact({
  history,
  setHistory,
  addMeetingToFavorites,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getMeetingHistory()
        .then((data) => {
          if (!data?.meeting_history) setHistory(null);
          else {
            Promise.all(
              data.meeting_history.slice(0, 5).map(async (meeting) => {
                return get(meeting.id)
                  .then((data) => {
                    return isMeetingInFavorite(meeting.id).then(
                      (isMeetingInFavorite) => {
                        return {
                          ...data,
                          ...meeting, // id + time
                          isMeetingInFavorite, // when returns- true: can add to favorite. false: disable
                        };
                      }
                    );
                  })
                  .catch(() => false);
              })
            ).then((combinedHistory) => {
              setHistory(combinedHistory);
            });
          }
          setHistory(
            data?.meeting_history
              ?.slice(0, 5)
              .map((meeting) => ({ ...meeting }))
          );
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          console.warn(e, "<- getting history");
        });
    }, [1000]);
  }, []);

  return (
    <div className="flex flex-row items-center h-full gap-x-2 justify-center">
      <div className="dark:bg-dark-800 dark:bg-opacity-50 h-3/4 w-3/4 rounded-3xl p-4 dark:shadow shadow-lg flex flex-col gap-y-2 relative">
        <h1 className="font-bold text-xl dark:text-white text-black">
          History
        </h1>
        <hr className="border-2"></hr>
        {loading ? (
          <LoadingComponent />
        ) : history ? (
          <HistoryComponent
            history={history}
            addMeetingToFavorites={addMeetingToFavorites}
          />
        ) : (
          <NoHistoryComponent />
        )}
      </div>
    </div>
  );
}
