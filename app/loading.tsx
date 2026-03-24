export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce">✨</div>
        <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}
