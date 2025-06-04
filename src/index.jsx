/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx } from "hono/jsx";
import { Hono } from "hono";

import { serveStatic } from "hono/cloudflare-pages";

import { Layout } from "./components/Layout.jsx";
import { Content } from "./components/Content.jsx";

import './style.css';

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    <Layout title="DeepNote.js" desc="A JS-based deep note generator">
      <Content />
    </Layout>
  );
});

app.all('*', (c) => {
  const path = c.req.path;
  const referrer = c.req.header('referer') || 'direct';
  console.log(`Redirecting unmatched path: ${path} (referred from: ${referrer}) to homepage`);
  return c.redirect('/');
});

export default app;