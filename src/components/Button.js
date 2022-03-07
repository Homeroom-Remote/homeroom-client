const buttonStyles = `rounded shadow-sm py-1 px-4 text-sm  \
  text-md font-bold \
  bg-blue-100 text-blue-500 \
  hover:bg-blue-200 active:bg-blue-100 transition-all`;

export default function Button({ text, ...props }) {
  return (
    <button className={buttonStyles} {...props}>
      {text}
    </button>
  );
}
