import { error } from '@sveltejs/kit';
import { xml2js } from 'xml-js';

export async function GET() {
  const url = 'https://lfm.xiffy.nl/skynx';

  try {
    const res = await fetch(url);
    const xmlText = await res.text();

    // Convertendo XML para JSON
    const result = xml2js(xmlText, { compact: true, spaces: 4 });
    const items = result.rss.channel.item.map(item => ({
      title: item.title._text || null,
      date: item.pubDate?._text ? new Date(item.pubDate?._text).toISOString() : null
    }));

    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    throw error(500, 'Erro ao buscar o feed RSS');
  }
}
