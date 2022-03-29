export const HeaderWithAction = ({ title, button }) => {
  return (
    <div className="bg-white shadow">
      <nav class="w-11/12 mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div class="w-full py-6 flex items-center justify-between border-b border-cyan-500 lg:border-none">
          <div class="flex items-center">
            <h1 className="ml-10 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
              {title}
            </h1>
          </div>
          <div class="ml-12 space-x-4">{button}</div>
        </div>
      </nav>
    </div>
  );
};
