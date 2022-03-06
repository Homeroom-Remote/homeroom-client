import Header from "./Header";
import QuickSelection from "./QuickSelection";
export default function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col gap-y-2">
      <Header />
      <div className="grid grid-flow-row grid-rows-2 grid-cols-2 h-full">
        <QuickSelection />
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
    </div>
  );
}
