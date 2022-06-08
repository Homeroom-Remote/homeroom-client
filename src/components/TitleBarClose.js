export default function TitleBarClose({ title, close }) {
  return (
    <div className="h-10 w-full flex flex-row justify-between px-2 dark:bg-dark-900 bg-lt-200">
      <p className="font-bold text-3xl">{title}</p>
      <button onClick={close} className="font-bold">
        X
      </button>
    </div>
  );
}
