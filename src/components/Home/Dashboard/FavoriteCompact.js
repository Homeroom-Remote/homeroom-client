import { getMeetingFavorite, get } from "../../../api/meeting";

// function NoFavoriteComponent() {
//     return (
//         <div className="w-full h-full flex items-center justify-center p-2">
//             <div className="flex flex-col max-h-full items-center justify-center">
//                 <h1 className="text-4xl font-medium text-primary-400">No History.</h1>
//                 <object data={NoHistorySVG} type="image/svg+xml">
//                     <img src="" alt="no history" />
//                 </object>
//             </div>
//         </div>
//     );
// }

// function LoadingComponent() {
//     return (
//         <div className="w-full h-full flex items-center justify-center">
//             <div className="flex w-1/2 h-1/2 items-center justify-center">
//                 <object data={LoadingSVG} type="image/svg+xml">
//                     <img src="" alt="loading" />
//                 </object>
//             </div>
//         </div>
//     );
// }

// function HistoryComponent({ history }) {
//     const { joinMeeting } = useMeeting();
//     const { setShow, setOpts } = usePopup();
//     const styles = {
//         head_th:
//             "px-6 align-middle border border-solid py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left dark:bg-dark-800 dark:text-text-200 dark:border-dark-700 bg-lt-400 text-text-200 border-lt-200",
//         body_td:
//             "border-t-0 text-lg px-6 py-2 align-middle border-l-0 border-r-0 whitespace-nowrap relative ",
//     };

//     const parseTime = (firebaseTimeObject) => {
//         const fireBaseTime = new Date(
//             firebaseTimeObject.seconds * 1000 +
//             firebaseTimeObject.nanoseconds / 1000000
//         );
//         return fireBaseTime.toDateString();
//     };
// }


export default function FavoriteCompact({ setOverlayComponent }) {
    // const [loading, setLoading] = useState(true);
    // const [favorite, setFavorite] = useState([]);

    // useEffect(() => {
    //     setLoading(true);
    //         setTimeout(() => {
    //         getMeetingHistory()
    //             .then((data) => {
    //                 if (!data?.meeting_history) setHistory(null);
    //                 else {
    //                     Promise.all(
    //                         data.meeting_history.map(async (meeting) => {
    //                             return get(meeting.id)
    //                                 .then((data) => {
    //                                     return {
    //                                         ...data,
    //                                         ...meeting, // id + time
    //                                     };
    //                                 })
    //                                 .catch(() => false);
    //                         })
    //                     ).then((combinedHistory) => {
    //                         setHistory(combinedHistory);
    //                     });
    //                 }
    //                 setHistory(data?.meeting_history?.map((meeting) => ({ ...meeting })));
    //                 setLoading(false);
    //             })
    //             .catch((e) => {
    //                 setLoading(false);
    //                 console.warn(e, "<- getting history");
    //                 });
    //         }, [1000]);
    // }, []);

    return (
        <div className="flex flex-row items-center h-full gap-x-2 justify-center">
            <div className="dark:bg-dark-800 h-3/4 w-3/4 rounded-3xl p-4 dark:shadow shadow-lg flex flex-col gap-y-2 relative">
                <h1 className="font-bold text-xl dark:text-white text-black">
                    Favorite
                </h1>
                <hr className="border-2"></hr>
                {/* {loading ? (
                    <LoadingComponent />
                ) : history ? (
                    <HistoryComponent history={history} />
                ) : (
                    <NoHistoryComponent />
                )} */
                    {/* <FavoriteComponent history={history} /> */ }

                }
            </div>
        </div>
    );
}