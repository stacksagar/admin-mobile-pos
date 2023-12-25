import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="w-full h-screen bg-white dark:bg-black flex flex-col-reverse items-center justify-center gap-16 py-44 md:gap-28 lg:flex-row lg:px-24">
      <div className="relative w-full py-12 xl:w-1/2">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="text-gray-800 my-2 text-2xl font-bold dark:text-white">
                Page Not Found!
              </h1>
              <p className="text-gray-800 my-2 dark:text-white">
                Sorry about that! Please visit our hompage to get where you need
                to go.
              </p>
              <Link
                to="/"
                className="md my-2 block w-full rounded border bg-indigo-600 py-4 px-8 text-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 sm:w-fit"
              >
                Take me there!
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img title="Not Found" src="https://i.ibb.co/ck1SGFJ/Group.png" />
      </div>
    </div>
  );
}
