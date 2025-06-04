/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx, Fragment } from "hono/jsx";

import { Inputs } from "./Inputs";
import { DeepNote } from "./DeepNote";
import { About } from "./About";
import { Icons } from "./Icons";

export const Content = () => (
  <>
    <main class="flex flex-col items-center justify-center">
      <div class="pt-5 flex flex-col items-center justify-center">
        <button id="titleModal">
          <h1
            class="w-max font-semibold text-3xl group transition duration-300 hover:translate-y-[-0.15rem] ease-in-out"
          >
            DeepNote.js<span
              class="block max-w-0 group-hover:max-w-full transition-all duration-50 h-0.5 bg-white"
            ></span>
          </h1>
        </button>
      </div>
      <About />
      <Icons />
      <div class="mt-3">
        <Inputs />
      </div>
      <div class="my-5">
        <DeepNote />
      </div>
    </main>
  </>
);