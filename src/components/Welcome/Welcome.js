import { Gmail, Github } from "../../utils/svgs";
import { signInWithGoogle } from "../../api/auth";
import Theme from "../Theme";

const globalStyles =
  // eslint-disable-next-line no-multi-str
  "bg-lt-50 text-text-900 \
                      dark:bg-dark-900 dark:text-text-200 \
                      transition-colors max-h-screen overflow-y-hidden";

const loginStyles = "flex flex-col justify-between";

const wrapperStyles = "h-screen flex justify-center items-center";
export default function Welcome(props) {
  const handleGoogleButtonClick = () => {
    console.log("Trying to sign in with google");
    signInWithGoogle((result) => console.log(result));
  };
  return (
    <div className={globalStyles}>
      <div className="flex justify-end p-2">
        <Theme />
      </div>
      <div className={wrapperStyles}>
        <section className={loginStyles}>
          <div className="max-w-md mx-4">
            <h1 className="text-5xl font-bold">
              Join{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Homeroom
              </span>
            </h1>
            <div className="flex flex-col justify-between mt-12 gap-y-2">
              <button
                onClick={handleGoogleButtonClick}
                className="flex-1 py-4 text-md font-semibold border-2 border-black dark:border-white hover:bg-background-300 dark:hover:bg-background-600 transition-colors"
              >
                <Gmail
                  className="inline w-8 h-8 fill-current"
                  title="Gmail icon"
                />
                <span className="ml-5">Gmail</span>
              </button>
              <button className="flex-1 py-4 text-md font-semibold border-2 border-black dark:border-white hover:bg-background-300 dark:hover:bg-background-600 transition-colors">
                <Github title="Github icon" className="inline w-8 h-8" />
                <span className="ml-5">Github</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
