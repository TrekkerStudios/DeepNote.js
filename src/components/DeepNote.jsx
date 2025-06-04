/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx, Fragment } from "hono/jsx";

export const DeepNote = () => (
  <>
    <div id="main-viewer">
      <div id="viewport" class="flex flex-col justify-center items-center">
        <div id="filter-status" class="flex flex-row text-lg font-light"></div>
        <div id="osc-grid" class="grid grid-cols-6 gap-3 text-sm font-light"></div>
      </div>
    </div>
  </>
);