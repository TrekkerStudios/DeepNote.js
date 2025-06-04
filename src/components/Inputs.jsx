/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx, Fragment } from "hono/jsx";

export const Inputs = () => (
    <>
        <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <div>
                    <label for="voices" class="font-light text-md">Number of voices: </label>
                    <input
                        type="number"
                        id="voices"
                        name="voices"
                        value="30"
                        maxLength="4"
                        required
                        class="bg-white text-black" />
                </div>
                <div>
                    <label for="time" class="font-light text-md">Duration: </label>
                    <input
                        type="number"
                        id="time"
                        name="time"
                        value="15"
                        maxLength="4"
                        required
                        class="bg-white text-black" />
                    <span> sec.</span>
                </div>
                <div class="volume-control flex flex-row gap-1">
                    <label for="volume">Volume:</label>
                    <input type="range" id="volume" min="0" max="100" value="50" step="1" />
                        <span id="volume-display">50%</span>
                </div>
            </div>
            <button id="startButton" class="bg-slate-500 rounded-lg px-4 py-2">Play</button>
        </div>
    </>
);