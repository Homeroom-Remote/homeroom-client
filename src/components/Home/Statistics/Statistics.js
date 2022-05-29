import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import NoHistorySVG from "../../../utils/tissue.svg";
import LectureResults from "./LectureResults";
import LectureGrade from "./LectureGrade";
import { get } from "../../../api/meeting";
import { getMeetingFromUserID, } from "../../../api/meeting";
import useUser from "../../../stores/userStore";
import LoadingSVG from "../../../utils/seo.svg";
import getBackgroundColor from "../../../utils/getBackgroundColor"



export default function Statistics() {

  const { user } = useUser()

  const [data, setData] = useState([])
  const [concentration, setConcentration] = useState([])
  const [participation, setParticipation] = useState([])

  const [grade, setGrade] = useState([])
  const [gradeToShow, setGradeToShow] = useState(0)

  const [tips, setTips] = useState([])
  const [tipsToShow, setTipsToShow] = useState([])


  const [loading, setLoading] = useState(true);








  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      get(getMeetingFromUserID(user.uid))
      .then((data) => {
        // Promise.all(
          console.log(data)
          setData(parserData(data))
          setGrade(parserGrade(data))
          setTips(parserTips(data))
          // )
      }).catch((e) => {
        console.log(data)
    }).finally(() => setLoading(false));
    }, [1000]);
  }, []);


  const handleChange = (event) => {
    var index = parseInt(event.target.value)
    var graphData = data[index]
    
    var ParticipationGraph = [["Minute", "Participation"]]
    var ConcentrationGraph = [["Minute", "Concentration"]]
    if(index == -1) {
      ParticipationGraph.push(["0", 0])
      ConcentrationGraph.push(["0", 0])
      setParticipation(ParticipationGraph)
      setConcentration(ConcentrationGraph)
      setGradeToShow(0)
      setTipsToShow([])
      return
    }
    console.log(graphData)
    for(var i = 1; i < graphData.length; i++) {
      graphData[i][1] = parseFloat(graphData[i][1])
      graphData[i][2] = parseFloat(graphData[i][2])
      ParticipationGraph.push([graphData[i][0], parseFloat(graphData[i][2])])
      ConcentrationGraph.push([graphData[i][0], parseFloat(graphData[i][1])])
    }
    setGradeToShow(parseFloat(grade[index]))
    setParticipation(ParticipationGraph)
    setConcentration(ConcentrationGraph)
    setTipsToShow(tips[index])
  };
  


  function parserData(data) {
      var toReturn = []
      for(var i = 0; i < data.meeting_logs.length; i++) {
        var arr = []
        arr.push(["Minute", "Concentration", "Participation"])
        var size = data.meeting_logs[i].log.length
        for(var j = 0; j < size; j++) {
          var temp = [j.toString(), data.meeting_logs[i].log[j].concentration.score, data.meeting_logs[i].log[j].expressions.participants]
          arr.push(temp)
        }
        toReturn.push(arr)
      }
      return toReturn
  }

  function parserGrade(data) {
    var toReturn = []
    for(var i = 0; i < data.meeting_logs.length; i++) {
      toReturn.push(data.meeting_logs[i].score.score)
    }
    return toReturn
}

function parserTips(data) {
  var toReturn = []
  for(var i = 0; i < data.meeting_logs.length; i++) {
    toReturn.push(data.meeting_logs[i].score.tips)
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
        backgroundColor: getBackgroundColor(),
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
    <div className="px-6 pt-6 py-16 2xl:container h-full absolute">
     <div className="flex justify-center items-center">
        <label>
        Choose lecture:
      <select color="red" onChange={handleChange} className=" bg-primary-700">
        <option value={-1}>Choose meeting</option>
      {data.map((meeting, index) => (<option value={index}>Meeting number {index + 1}</option>))}
      </select>
      </label>
    </div>
        <div className="grid gap-6 grid-cols-2 h-full">
          {console.log(concentration)}
          <div className=" grid grid-rows-2 h-full">
          {concentration.length > 1 ? <LectureResults data={concentration} options={options} header={"Concentration Performance"} />: <LectureResults data={[["Minute", "Concentration"], ["0", 0]]} options={options} header={"Concentration Performance"} />}
          {participation.length > 1 ? <LectureResults data={participation} options={options} header={"Participation Performance"} />: <LectureResults data={[["Minute", "Participation"], ["0", 0]]} options={options} header={"Participation Performance"} />}
          </div>
          <div>
          {gradeToShow >= 0 && <LectureGrade grade={gradeToShow} tips={tipsToShow}/>}
          </div>
        </div>
    </div>
  );
}