import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import NoHistorySVG from "../../../utils/tissue.svg";
import LectureResults from "./LectureResults";
import LectureGrade from "./LectureGrade";
import { get } from "../../../api/meeting";
import { getMeetingFromUserID, } from "../../../api/meeting";
import useUser from "../../../stores/userStore";
import LoadingSVG from "../../../utils/seo.svg";



export default function Statistics() {
  const { user } = useUser()
  const [data, setData] = useState([])
  const [grade, setGrade] = useState(0)
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      get(getMeetingFromUserID(user.uid))
      .then((data) => {
        Promise.all(
          setData(parserData(data)),
          setGrade(82)
          )
      }).then(() => {
        setLoading(false);
      }).catch((e) => {
        console.log(data)
        setLoading(false);
    });
    }, [1000]);
  }, []);
  


  function parserData(data) {
      var toReturn = []
      toReturn.push(["Minute", "Concentration", "Participation"])
      for(var i = 0; i < 1; i++) {
        var size = data.meeting_logs[i].log.length
        for(var j = 0; j < size; j++) {
          console.log(data.meeting_logs[i].log[j])
          var temp = [j.toString(), data.meeting_logs[i].log[j].concentration.score, data.meeting_logs[i].log[j].expressions.participants]
          toReturn.push(temp)
        }
      }
      return toReturn
  }

    // const data = [
    //     ["Minute", "Concentration", "Participation"],
    //     ["1", 803, 400],
    //     ["2", 500, 460],
    //     ["3", 660, 100],
    //     ["4", 100, 540],
    //   ];
      const options = {
        curveType: "function",
        legend: { position: "bottom" },
        colors: ['rgb(192, 132, 252)', 'rgb(74, 222, 128)'],
        backgroundColor: 'white',
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

      if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center p-2">
                <div className="flex flex-col max-h-full items-center justify-center">
                    <h1 className="text-4xl font-medium text-primary-400">
                        No statistics yet
                    </h1>
                    <h3 className="text-md mt-4">
                      Once you join your meeting and a participant will turn on his camera it will be displayed here.
                    </h3>
                    <object data={NoHistorySVG} type="image/svg+xml">
                        <img src="" alt="no favorite" />
                    </object>
                </div>
            </div>
        );
    }

  return (
    <div className="px-6 pt-6 py-16 2xl:container h-full">
        <div className="grid gap-6 grid-cols-2 h-full ">
            <LectureResults data={data} options={options} />
            <LectureGrade grade={grade}/>
        </div>
    </div>
  );
}