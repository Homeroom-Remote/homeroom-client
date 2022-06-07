import Theme from "../Theme";

export default function Header() {
  return (
    <header className="w-full max-h-10 dark:bg-dark-800 dark:bg-opacity-50 bg-lt-300 bg-opacity-80 flex flex-row justify-between p-2 shadow-2xl">
      <h1 className="text-lg dark:text-white text-black font-bold">Homeroom</h1>
      <Theme />
    </header>
  );
}
