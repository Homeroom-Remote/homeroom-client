function ToolbarButton(props) {
  const { toggleCamera } = props.toggle;
  <button onClick={toggleCamera}></button>;
}

export default function Toolbar(props) {
  const toggleCamera = () => {};
  const toggleMicrophone = () => {};
  return (
    <div className="flex flex-row justify-between bg-red-200 w-full">
      {/* Camera */}
      <ToolbarButton toggle={toggleCamera} />
      {/* Microphone */}
      <ToolbarButton toggle={toggleMicrophone} />
    </div>
  );
}
