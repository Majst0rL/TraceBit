type UserTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function UserTabs({ activeTab, setActiveTab }: UserTabsProps) {
  return (
    <nav className="flex border-b border-gray-300 mb-6">
      {[
        { id: "newFingerprint", label: "New fingeprint" },
        { id: "history", label: "Fingerprint history" },
      ].map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${
            activeTab === id
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent hover:text-indigo-600 hover:border-indigo-600"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
