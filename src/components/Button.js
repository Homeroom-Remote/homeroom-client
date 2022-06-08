const buttonStyles = `rounded shadow-sm py-1 px-4 text-md  \
  text-md font-bold \
  dark:text-white text-dark-900 \
  hover:bg-primary-400 active:bg-primary-600 transition-all duration-100 ease-out border border-lt-500 hover:border-lt-200 dark:border-dark-400 dark:hover:border-dark-900`;

export default function Button({ text, ...props }) {
  return (
    <button className={buttonStyles} {...props}>
      {text}
    </button>
  );
}
