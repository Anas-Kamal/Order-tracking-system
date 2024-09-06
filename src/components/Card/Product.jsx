import React from "react";
import { GalaxyTowels, KanbanIcon } from "../../constant/images";

export const Product = () => {
  return (
    <div class="w-1/5  bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex gap-2">
        <div>
          <img
            className="rounded-tl-md"
            src={GalaxyTowels}
            height={70}
            width={70}
          />
        </div>
        <div className="p-1">
          <h5 class="text-sm font-semibold tracking-tight text-gray-900 ">
            Galaxy Towels
          </h5>
          <p class="text-[10px] font-medium m-0 tracking-tight text-gray-900 ">
            <span className="font-thin">Id :</span> 1223
          </p>
          <p class="text-[10px] font-medium m-0 tracking-tight text-gray-900 ">
            <span className="font-thin">Price :</span> $400
          </p>
          <p class="text-[10px] font-medium m-0 tracking-tight text-gray-900 ">
            <span className="font-thin">Quantity :</span> 2
          </p>
        </div>
      </div>
    </div>
  );
};
