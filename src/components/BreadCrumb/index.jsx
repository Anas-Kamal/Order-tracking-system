import React from "react";
import { OrderIcon } from "../../constant/images";
import { useNavigate } from "react-router-dom";

export const Breadcrumb = () => {
  const router = useNavigate()
  return (
    <nav
      className="flex px-10  text-gray-700 border border-gray-200 rounded-lg bg-gray-50"
      aria-label="Breadcrumb"
    >
      <button title="Back" onClick={() => router(-1)} className="inline-flex items-center justify-center w-8 h-8 mr-10 my-3 text-white transition-colors duration-150 bg-primary-color rounded-full focus:shadow-outline hover:bg-gray-200 hover:text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </button>

      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a
            href="#"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-primary-color"
          >
            <img className="w-5 h-5 mr-2.5" src={OrderIcon} alt="order" />
            Order
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="w-3 h-3 mx-1 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <a
              href="#"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-primary-color"
            >
              Order Lists
            </a>
          </div>
        </li>
        {/* <li aria-current="page">
          <div className="flex items-center">
            <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              Flowbite
            </span>
          </div>
        </li> */}
      </ol>
    </nav>
  );
};
