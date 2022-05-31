import starImage from "../utils/starFavorite.png";
const buttonStyles = `rounded shadow-sm py-1 px-4 text-sm  \
  text-md font-bold \
  text-blue-500 object-contain\
  hover:opacity-50 active:bg-blue-100 transition-all`;

export default function StarButton({ text, ...props }) {
  return (
    <button className={buttonStyles} {...props}>
      <img src={starImage} alt="star" style={{ height: 20 }} />
    </button>
  );
}
