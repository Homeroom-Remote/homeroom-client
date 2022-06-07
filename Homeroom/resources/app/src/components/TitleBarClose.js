export default function TitleBarClose({ title, close }) {
  return (
    <div className="h-6 w-full flex flex-row justify-between px-2 dark:bg-dark-800 bg-lt-200">
      <p className="font-bold">{title}</p>
      <button onClick={close} className="font-bold">
        X
      </button>
    </div>
  );
}
