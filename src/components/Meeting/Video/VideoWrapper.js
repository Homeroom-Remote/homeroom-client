import RegularVideoDisplay from "./RegularVideoDisplay";
import ScreenShareVideoDisplay from "./ScreenShareVideoDisplay";

export default function VideoWrapper(props) {
  console.log(props);
  if (props.shareScreenMode) return <ScreenShareVideoDisplay {...props} />;
  return <RegularVideoDisplay {...props} />;
}
