import { useEffect, useState } from "react";
import { getMeetingFavorite, get, handleRemoveFromFavorite } from "../../../api/meeting";
import NoHistorySVG from "../../../utils/tissue.svg";
import LoadingSVG from "../../../utils/seo.svg";
import useMeeting from "../../../stores/meetingStore";
import usePopup from "../../../stores/popupStore";
import Button from "../../Button";
import RemoveButton from "../../RemoveButton"
import OnlineIndicator from "../../OnlineIndicator";


export default function Favorite({ setOverlayComponent }) {
    const [loading, setLoading] = useState(true);
    const [favorite, setFavorite] = useState([]);
    const { joinMeeting } = useMeeting();

    const styles = {
        head_th:
            "px-6 align-middle border border-solid py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left dark:bg-dark-800 dark:text-text-200 dark:border-dark-700 bg-lt-400 text-text-200 border-lt-200",
        body_td:
            "border-t-0 text-lg px-6 py-2 align-middle border-l-0 border-r-0 whitespace-nowrap relative ",
    };

    const parseTime = (firebaseTimeObject) => {
        const fireBaseTime = new Date(
            firebaseTimeObject.seconds * 1000 +
            firebaseTimeObject.nanoseconds / 1000000
        );
        return fireBaseTime.toDateString();
    };

    const hasMeetingsOnline = () =>
        favorite.findIndex((meeting) => meeting.status === "online") >= 0;

    function removeMeetingFromFavoritesById(id) {
        if (!id) return;
        setFavorite((oldFavorites) => oldFavorites.filter((fav) => fav.id !== id));
    }

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getMeetingFavorite()
                .then((data) => {
                    if (!data?.meeting_favorite) setFavorite(null);
                    else {
                        Promise.all(
                            data.meeting_favorite.map(async (meeting) => {
                                return get(meeting.id)
                                    .then((data) => {
                                        return {
                                            ...data,
                                            ...meeting, // id + time
                                        };
                                    })
                                    .catch(() => false);
                            })
                        ).then((combinedFavorite) => {
                            setFavorite(combinedFavorite);
                        });
                    }
                    setFavorite(data?.meeting_favorite?.map((meeting) => ({ ...meeting })));
                    setLoading(false);
                })
                .catch((e) => {
                    setLoading(false);
                    console.warn(e, "<- getting favorite");
                });
        }, [1000]);
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full self-center flex items-center justify-center dark:bg-dark-800 p-2">
                <object data={LoadingSVG} type="image/svg+xml">
                    <img src="" alt="loading" />
                </object>
            </div>
        );
    }

    if (!favorite) {
        return (
            <div className="w-full h-full flex items-center justify-center p-2">
                <div className="flex flex-col max-h-full items-center justify-center">
                    <h1 className="text-4xl font-medium text-primary-400">
                        No favorite meetings yet
                    </h1>
                    <h3 className="text-2xl mt-4">
                        Once you click the "Star" button on a meeting in the meeting history list, it will be displayed here.
                    </h3>
                    <object data={NoHistorySVG} type="image/svg+xml">
                        <img src="" alt="no favorite" />
                    </object>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse table-auto">
                <thead>
                    <tr>
                        <th className={styles.head_th}>Owner</th>
                        <th className={styles.head_th}>Status</th>
                        <th className={styles.head_th}>Last Joined</th>
                        {hasMeetingsOnline() && <th className={styles.head_th}>Options</th>}
                    </tr>
                </thead>
                <tbody>
                    {favorite.map((meeting, index) => (
                        <tr key={`meeting-${meeting.id}-${index}`}>
                            <td className={styles.body_td + "border-r"}>
                                {meeting.owner_name}
                            </td>
                            <td
                                className={
                                    styles.body_td + "border-r flex items-center gap-x-4"
                                }
                            >
                                <div className="relative">
                                    <OnlineIndicator
                                        online={meeting.status === "online"}
                                        ping={false}
                                        center={true}
                                    />
                                </div>
                                <p className="font-medium">
                                    {meeting.status === "online" ? "Online" : "Offline"}
                                </p>
                            </td>
                            <td className={styles.body_td}>{parseTime(meeting.at)}</td>
                            <td className={styles.body_td + "border-l"}>

                                {meeting.status === "online" && (
                                    <Button text="Join" onClick={() => joinMeeting(meeting.id)} />
                                )}

                                <RemoveButton
                                    text="Fav"
                                    onClick={() => {
                                        removeMeetingFromFavoritesById(meeting.id)
                                        handleRemoveFromFavorite(meeting)
                                    }}
                                />
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}