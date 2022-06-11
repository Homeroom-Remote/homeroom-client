import { useEffect, useState } from "react";
import NoHistorySVG from "../../../utils/tissue.svg";
import LectureResults from "./LectureResults";
import LectureGrade from "./LectureGrade";
import { get } from "../../../api/meeting";
import { getMeetingFromUserID } from "../../../api/meeting";
import useUser from "../../../stores/userStore";
import LoadingSVG from "../../../utils/seo.svg";
import useTheme from "../../../stores/themeStore";

export default function Statistics() {
  const { getBgFromTheme, getTextFromTheme } = useTheme();
  const { user } = useUser();

  const [concentrationData, setConcentrationData] = useState();
  const [concentrationToShow, setConcentrationToShow] = useState([]);

  const [participationData, setParticipationData] = useState();
  const [participationToShow, setParticipationToShow] = useState([]);

  const [expressionsData, setExpressionsData] = useState();
  const [expressionsToShow, setExpressionsToShow] = useState([]);

  const [grade, setGrade] = useState([]);
  const [gradeToShow, setGradeToShow] = useState(0);

  const [tips, setTips] = useState([]);
  const [tipsToShow, setTipsToShow] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      get(getMeetingFromUserID(user.uid))
        .then((data) => {
          setParticipationData(parserParticipationData(data));
          setExpressionsData(parserExpressionsData(data));
          setConcentrationData(parserConcentrationData(data));
          setGrade(parserGrade(data));
          setTips(parserTips(data));
        })
        .catch((e) => {
          console.error(e);
          console.warn("data for above warning", e);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [1000]);
  }, []);

  useEffect(() => {
    if (!loading && participationData && participationData.length > 0)
      handleChange(0);
  }, [loading]);

  function fromJToTime(j) {
    var seconds = (j + 1) * 5,
      minutes = 0,
      hours = 0;
    while (seconds >= 60) {
      minutes += 1;
      seconds -= 60;
    }
    while (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  }

  function secondsToTime(seconds) {
    var minutes = 0,
      hours = 0;
    while (seconds >= 60) {
      minutes += 1;
      seconds -= 60;
    }
    while (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  }

  function handleChange(event) {
    var index = event === 0 ? 0 : parseInt(event.target.value);
    setParticipationToShow(participationData[index]);
    setConcentrationToShow(concentrationData[index]);
    setExpressionsToShow(expressionsData[index]);
    setGradeToShow(parseFloat(grade[index]));
    setTipsToShow(tips[index]);
  }

  function parserParticipationData(data) {
    var toReturn = [];
    for (var i = 0; i < data.meeting_logs.length; i++) {
      var arr = [];
      arr.push(["Minute", "Questions", "Chat"]);
      var size = data.meeting_logs[i].engagementLogs.length;
      var questionSum = 0,
        chatSum = 0;
      for (var j = 0; j < size; j++) {
        if (data.meeting_logs[i].engagementLogs[j].event === "message")
          chatSum++;
        else if (data.meeting_logs[i].engagementLogs[j].event === "question")
          questionSum++;
        var temp = [
          secondsToTime(parseInt(data.meeting_logs[i].engagementLogs[j].after)),
          questionSum,
          chatSum,
        ];
        arr.push(temp);
      }
      toReturn.push(arr);
    }
    return toReturn;
  }

  function parserConcentrationData(data) {
    var toReturn = [];
    for (var i = 0; i < data.meeting_logs.length; i++) {
      var arr = [];
      arr.push(["Minute", "Concentration"]);
      var size = data.meeting_logs[i].log.length;
      for (var j = 0; j < size; j++) {
        var temp = [
          fromJToTime(j),
          data.meeting_logs[i].log[j].concentration.score,
        ];
        arr.push(temp);
      }
      toReturn.push(arr);
    }
    return toReturn;
  }

  function parserExpressionsData(data) {
    var toReturn = [];
    for (var i = 0; i < data.meeting_logs.length; i++) {
      var arr = [];
      arr.push([
        "Minute",
        "Angry",
        "Disgusted",
        "Fearful",
        "Happy",
        "Neutral",
        "Sad",
        "Surprised",
      ]);
      var size = data.meeting_logs[i].log.length;
      for (var j = 0; j < size; j++) {
        var temp = [
          fromJToTime(j),
          data.meeting_logs[i].log[j].expressions.expressions.angry,
          data.meeting_logs[i].log[j].expressions.expressions.disgusted,
          data.meeting_logs[i].log[j].expressions.expressions.fearful,
          data.meeting_logs[i].log[j].expressions.expressions.happy,
          data.meeting_logs[i].log[j].expressions.expressions.neutral,
          data.meeting_logs[i].log[j].expressions.expressions.sad,
          data.meeting_logs[i].log[j].expressions.expressions.surprised,
        ];
        arr.push(temp);
      }
      toReturn.push(arr);
    }
    return toReturn;
  }

  function parserGrade(data) {
    var toReturn = [];
    for (var i = 0; i < data.meeting_logs.length; i++) {
      toReturn.push(data.meeting_logs[i].score.score);
    }
    return toReturn;
  }

  function parserTips(data) {
    var toReturn = [];
    for (var i = 0; i < data.meeting_logs.length; i++) {
      toReturn.push(data.meeting_logs[i].score.tips);
    }
    return toReturn;
  }

  const optionsForConcentrationGraph = {
    curveType: "function",
    legend: {
      position: "bottom",
      textStyle: { color: getTextFromTheme() },
    },
    colors: ["rgb(192, 132, 252)", "rgb(74, 222, 128)"],
    hAxis: {
      title: "Time",
      textStyle: { color: getTextFromTheme() },
      titleTextStyle: { color: getTextFromTheme(), bold: true },
    },
    vAxis: {
      title: "Score",
      textStyle: { color: getTextFromTheme() },
      titleTextStyle: { color: getTextFromTheme(), bold: true },
    },
    backgroundColor: getBgFromTheme(),
    lineWidth: 4,
  };

  const optionsForParticipationGraph = {
    legend: {
      position: "bottom",
      textStyle: { color: getTextFromTheme() },
    },
    colors: ["rgb(192, 132, 252)", "rgb(74, 222, 128)"],
    hAxis: {
      title: "Time",
      textStyle: { color: getTextFromTheme() },
      titleTextStyle: { color: getTextFromTheme(), bold: true },
    },
    vAxis: {
      title: "Count",
      textStyle: { color: getTextFromTheme() },
      titleTextStyle: { color: getTextFromTheme(), bold: true },
    },
    backgroundColor: getBgFromTheme(),
    lineWidth: 1,
    rotated: true,
  };
  const optionsForExpressionsGraph = {
    curveType: "function",
    legend: {
      position: "bottom",
      textStyle: { color: getTextFromTheme() },
    },
    colors: ["#f43f5e", "#14b8a6", "#d946ef", "#3b82f6", "#94a3b8", "#fdba74"],
    hAxis: {
      title: "Time",
      textStyle: { color: getTextFromTheme() },
      titleTextStyle: { color: getTextFromTheme(), bold: true },
    },
    vAxis: {
      title: "Score",
      viewWindow: { min: 0, max: 1 },
      textStyle: { color: getTextFromTheme() },
      titleTextStyle: { color: getTextFromTheme(), bold: true },
    },
    backgroundColor: getBgFromTheme(),
    lineWidth: 4,
  };

  if (loading) {
    return (
      <div className="w-full h-full self-center flex items-center justify-center dark:bg-dark-800 p-2">
        <object data={LoadingSVG} type="image/svg+xml">
          <img src="" alt="loading" />
        </object>
      </div>
    );
  }

  if (!participationData || participationData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2">
        <div className="flex flex-col max-h-full items-center justify-center">
          <h1 className="text-4xl font-medium text-primary-400">
            No statistics yet
          </h1>
          <h3 className="text-md mt-4">
            Once you join your meeting and a participant will turn on his camera
            it will be displayed here.
          </h3>
          <object
            data={NoHistorySVG}
            type="image/svg+xml"
            className="w-80 xl:w-auto"
          >
            <img src="" alt="no statistics" />
          </object>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 py-16 2xl:container h-full overflow-auto">
      <div className="flex flex-col justify-center items-center mb-4">
        <select
          id="meeting"
          onChange={handleChange}
          className="bg-lt-100 border border-gray-300 text-gray-900 
          text-md rounded focus:ring-primary-500 focus:border-primary-500 
          block p-4 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 
          dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        >
          {concentrationData.map((meeting, index) => (
            <option
              key={`meeting-n-${index}`}
              value={index}
              className="dark:bg-dark-700 transition ease-in-out duration-100 my-1.5 hover:dark:bg-primary-500"
            >
              Meeting number {index + 1}
            </option>
          ))}
        </select>
      </div>
      <div className=" w-[50%] ml-[25%] mb-16">
        {gradeToShow >= 0 && (
          <LectureGrade grade={gradeToShow} tips={tipsToShow} />
        )}
      </div>
      <div className=" grid grid-rows-2 h-full">
        <div className="grid grid-cols-12 h-full col-span-4">
          <div className="  col-start-2 col-span-10 mb-4">
            <LectureResults
              data={
                concentrationToShow.length > 1
                  ? expressionsToShow
                  : [
                      ["Minute", "Expressions"],
                      ["0", 0],
                    ]
              }
              options={optionsForExpressionsGraph}
              header={"Expressions Performance"}
            />
          </div>

          <div className=" col-span-5 col-start-2 w-full mb-20 gap-4 -ml-2">
            <LectureResults
              data={
                concentrationToShow.length > 1
                  ? concentrationToShow
                  : [
                      ["Minute", "Concentration"],
                      ["0", 0],
                    ]
              }
              options={optionsForConcentrationGraph}
              header={"Concentration Performance"}
            />
          </div>
          <div className=" col-start-7 col-span-5 w-full mb-20 ml-2">
            <LectureResults
              data={
                participationToShow.length > 1
                  ? participationToShow
                  : [
                      ["Minute", "Questions", "Chat"],
                      ["0", 0, 0],
                    ]
              }
              options={optionsForParticipationGraph}
              header={"Participation Performance"}
              isAreaChart={true}
            />
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}
