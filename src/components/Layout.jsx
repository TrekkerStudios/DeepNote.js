/** @jsx jsx */
/** @jsxFrag Fragment */
import { html } from "hono/html";
import { jsx, Fragment } from "hono/jsx";

export const Layout = (props) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/assets/favicon.png" />
      <link rel="preconnect" href="https://rsms.me/" />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <link rel="stylesheet" href="/assets/style.css" />
      <title>{props.title}</title>
      <meta name="description" content={props.desc} />
      <meta name="plea" content="thx/lucasarts don't sue me plz it's all educational" />
      <script src="/assets/DeepNote.js"></script>
    </head>
    <body class="bg-black min-h-max max-w-screen">
      <div>{props.children}</div>
    </body>
    {html`
    <script>
      document.addEventListener("DOMContentLoaded", async function () {
        const titleModalButton = document.getElementById("titleModal");
        const closeModal = document.getElementById("closeModal");
        const modal = document.getElementById("aboutPage");

        function openCheck(modal) {
            if (modal.open) {
                console.log("Dialog open");
            } else {
                console.log("Dialog closed");
            }
        }

        titleModalButton.addEventListener("click", () => {
            modal.showModal();
            openCheck(modal);
        });

        closeModal.addEventListener("click", () => {
            modal.close();
            openCheck(modal);
        });
     });
    </script>
    `}
  </html>
);