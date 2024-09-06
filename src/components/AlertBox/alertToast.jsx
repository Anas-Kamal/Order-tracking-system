import React, { useContext } from "react";
import { AlertContext } from "../../context/alertContext";

export const AlertToast = ({ message }) => {
  const { alertState, setShowAlert } = useContext(AlertContext);

  if (alertState.isShowAlert) {
    return (
      <div
        id="alert-border-2"
        className="flex gap-2 w-auto absolute right-5 top-5 items-center p-4 mb-4 text-white-800 bg-yellow-300 z-50"
        role="alert"
      >
        <svg
          className="flex-shrink-0 w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <div className="ml-3 text-sm font-medium">
          {alertState.alertMessage}
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-5 w-5  dark:hover:bg-gray-700"
          data-dismiss-target="#alert-border-2"
          aria-label="Close"
          onClick={() => setShowAlert(false)}
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    );
  }
  return null;
};
