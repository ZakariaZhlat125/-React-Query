interface Props {
  error: Error;
  onRetry?: () => void;
}

export default function ErrorFallback({ error, onRetry }: Props) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1 text-sm">{error.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
