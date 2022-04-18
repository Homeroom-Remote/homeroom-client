import { useState, useEffect } from "react";

export default function usePython(stream) {
    const [pythonShell, setPythonShell] = useState(null);
    const [pyshell, setPyshell] = useState(null)


    useEffect(() => {
        setPythonShell(window.require("python-shell"))
    }, []);

    useEffect(() => {
        console.log("start: pythonShell")
        setPyshell(new pythonShell.PythonShell("../python/hand_gestures/main.py", {
            mode: "text",
        }))
    }, [pythonShell])

    useEffect(() => {
        pyshell.on("message", (message) => {
            console.log("MESSEGE");
            console.log(message);
        }

        )
    }, [pyshell])


    function sendScreenshotURI(uri) {
        pyshell.send(uri);
    }

    return { sendScreenshotURI }
}