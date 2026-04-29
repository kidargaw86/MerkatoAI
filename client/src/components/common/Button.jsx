export default function Button({ children, ...props }) {
  return (
    <button
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      {...props}
    >
      {children}
    </button>
  );
}
