export default function Overlay({ close, Component }) {
  const handleKey = (event) => {
    if (event.code === "Escape") close();
  };
  if (Component === null) return <></>;
  return (
    <div
      className="w-full h-full absolute z-10 flex items-center justify-center bg-black bg-opacity-60"
      onKeyDown={handleKey}
    >
      <Component.Component close={close} />
    </div>
  );
}
