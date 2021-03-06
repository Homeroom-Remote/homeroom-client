import useUser from "../../../stores/userStore";

export default function Header() {
  const { user } = useUser();
  const getGreeting = () => {
    const metadata = user?.metadata;
    if (metadata.createdAt === metadata.lastLoginAt) return "Welcome";

    return "Welcome back";
  };
  return (
    <h1 className="text-3xl p-2 self-center">
      {getGreeting()}{" "}
      <span className="text-primary-400">{user?.displayName}🎉</span>
    </h1>
  );
}
