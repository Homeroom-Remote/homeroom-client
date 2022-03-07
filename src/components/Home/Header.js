import Theme from "../Theme";

export default function Header() {
  return (
    <header className="w-full max-h-10 dark:bg-dark-800 bg-lt-50 flex flex-row justify-between p-2">
      <h1 className="text-lg dark:text-white text-black font-bold">Homeroom</h1>
      <Theme />
    </header>
  );
}
