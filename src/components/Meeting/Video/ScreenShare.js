export default function ScreenShare({ stream, me }) {
  console.log(stream);
  return (
    <div
      className={
        "h-full w-auto dark:bg-dark-800 bg-lt-300 place-items-center justify-center flex p-1 shadow-lg rounded-lg relative box-border " +
        (me && "border-primary-400 border")
      }
    >
      <video
        className="object-contain"
        ref={(e) => {
          if (e) e.srcObject = stream;
        }}
        autoPlay={true}
      />
    </div>
  );
}
