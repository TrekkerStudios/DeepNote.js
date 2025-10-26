/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx } from "hono/jsx";
import { Hono } from "hono";

import { Layout } from "./components/Layout.jsx";
import { Content } from "./components/Content.jsx";

import './style.css';

const app = new Hono();

// Serve static assets manually using the ASSETS binding
app.get('/assets/*', async (c) => {
  const path = c.req.path.replace('/assets/', '');
  try {
    const asset = await c.env.ASSETS.fetch(new URL(path, 'https://example.com'));
    if (asset.status === 404) {
      return c.notFound();
    }
    return asset;
  } catch (error) {
    console.error('Asset serving error:', error);
    return c.notFound();
  }
});

app.get('/favicon.ico', async (c) => {
  try {
    const asset = await c.env.ASSETS.fetch(new URL('favicon.png', 'https://example.com'));
    if (asset.status === 404) {
      return c.notFound();
    }
    return asset;
  } catch (error) {
    console.error('Favicon serving error:', error);
    return c.notFound();
  }
});

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