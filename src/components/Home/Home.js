const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-background-100 text-text-900 \
                      dark:bg-background-800 dark:text-text-200 \
                      transition-colors max-h-screen h-screen overflow-y-hidden";
export default function Home() {
  return (
    <div className={globalStyles}>
      <h1>Home Screen</h1>
    </div>
  );
}
