export default function SecondPage() {
  return (
    <div className="min-h-screen p-8 sm:p-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Привет, мир!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
            <h2 className="text-xl font-semibold mb-4">Первая колонка</h2>
            <p className="text-base">
              Это текст первой колонки.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
            <h2 className="text-xl font-semibold mb-4">Вторая колонка</h2>
            <p className="text-base">
              Это текст второй колонки. 
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="rounded-full border border-solid border-transparent 
            transition-colors flex items-center justify-center bg-foreground 
            text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] 
            text-sm sm:text-base h-10 sm:h-12 px-8 sm:px-10">
            Нажми меня
          </button>
        </div>
      </div>
    </div>
  );
} 