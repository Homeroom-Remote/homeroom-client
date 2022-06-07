import removeIcon from "../utils/removeFavorite.png";
const buttonStyles = `rounded shadow-sm py-1 px-4 text-sm  \
  text-md font-bold \
  object-contain\
  hover:opacity-50 active:bg-blue-100 transition-all`;

export default function RemoveButton({ text, ...props }) {
  return (
    <button {...props}>
      <img
        src={removeIcon}
        alt="remove from favorites"
        style={{ height: 25 }}
      />
    </button>
  );
}
