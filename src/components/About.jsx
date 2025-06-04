/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx, Fragment } from "hono/jsx";

export const About = () => (
    <>
        <dialog id="aboutPage" class="fixed inset-0 m-auto w-96 h-fit p-6 rounded-lg shadow-xl text-white bg-slate-700">
            <h2 class="text-2xl font-semibold mb-4">DeepNote.js</h2>
            <p class="mb-4 text-md font-thin">
                <span>Created by </span>
                <a href="https://trekker.holdings" target="_blank" class="font-light underline">Trekker Holdings</a>
                <span> under the </span>
                <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" class="font-light underline">
                    CC BY-NC license
                </a>
                <span> as an educational exercise.</span>
            </p>
            <p class="mb-4 text-md font-thin">
                <span>The resulting sound is entirely generated in real-time in the browser using the </span>
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank" class="font-light underline">
                    Web Audio API
                </a>
                <span>. This project is not endorsed by or affiliated with THX/LucasArts.</span>
            </p>
            <p class="mb-4 text-md font-thin">
                <span>Enter a number of oscillator voices and a duration to generate a custom "deep note." The original version
                    from the 80s used 30 voices, while the modern digital recreation uses 80 or more.</span>
            </p>
            <button id="closeModal" class="px-4 py-2 bg-slate-500 text-white rounded font-light text-md transition duration-300 hover:bg-slate-400 ease-in-out">
                Close
            </button>
        </dialog>
    </>
);