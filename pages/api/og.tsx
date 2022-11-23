import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};


export const wikiHeaders = new Headers({
  "Api-User-Agent": "open-graph-six-degrees-of-wiki-adventure/1.1 "
});

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const lang = searchParams.get("lang");
    const start = parseInt( searchParams.get("start") || "" );
    const end   = parseInt( searchParams.get("end") || "" );

    if (lang == null) throw 'You need to mention the wikipedia lang in search params';

    if (!(start > 0 && end > 0)) throw 'You need to mention the wikipedia start page and end page id in search params';

    const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
    url.search = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      prop: "description|pageimages",
      piprop: "thumbnail",
      pithumbsize: "160",
      pageids: [start, end].join("|"),
      redirects: "1", // Automatically resolve redirects
      origin: "*"
    }).toString();

    const response:WikiPreviewResponse = await fetch(url.toString(), { headers: wikiHeaders }).then((r) => r.json());

    if (typeof response?.query?.pages === 'undefined' || response.query.pages.length < 2) throw "Wikipedia page doesn't lead to any page";

    const pageMap = new Map( response.query.pages.map(p => [p.pageid, p]) );
    if (!pageMap.has(start) || !pageMap.has(end)) throw "Wikipedia page doesn't lead to any page";

    const startPage = pageMap.get(start)!;
    const endPage   = pageMap.get(end)!;

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#fff',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #111',
            fontFamily: 'Inter',
            fontSize: '40px',
            fontWeight: 700,
            // boxShadow: '0 0 3% 0 #000',
            color: '#000'
          }}
        >
          <svg style={{position: 'absolute', inset: '0px'}} xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 800 800'><rect fill='#EEFFFF' width='800' height='800'/><defs><radialGradient id='a' cx='400' cy='400' r='50%' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='#EEFFFF'/><stop offset='1' stop-color='#CCEEFF'/></radialGradient><radialGradient id='b' cx='400' cy='400' r='70%' gradientUnits='userSpaceOnUse'><stop offset='0' stop-color='#EEFFFF'/><stop offset='1' stop-color='#CCFFFF'/></radialGradient></defs><rect fill='url(#a)' width='800' height='800'/><g fill-opacity='0.27'><path fill='url(#b)' d='M998.7 439.2c1.7-26.5 1.7-52.7 0.1-78.5L401 399.9c0 0 0-0.1 0-0.1l587.6-116.9c-5.1-25.9-11.9-51.2-20.3-75.8L400.9 399.7c0 0 0-0.1 0-0.1l537.3-265c-11.6-23.5-24.8-46.2-39.3-67.9L400.8 399.5c0 0 0-0.1-0.1-0.1l450.4-395c-17.3-19.7-35.8-38.2-55.5-55.5l-395 450.4c0 0-0.1 0-0.1-0.1L733.4-99c-21.7-14.5-44.4-27.6-68-39.3l-265 537.4c0 0-0.1 0-0.1 0l192.6-567.4c-24.6-8.3-49.9-15.1-75.8-20.2L400.2 399c0 0-0.1 0-0.1 0l39.2-597.7c-26.5-1.7-52.7-1.7-78.5-0.1L399.9 399c0 0-0.1 0-0.1 0L282.9-188.6c-25.9 5.1-51.2 11.9-75.8 20.3l192.6 567.4c0 0-0.1 0-0.1 0l-265-537.3c-23.5 11.6-46.2 24.8-67.9 39.3l332.8 498.1c0 0-0.1 0-0.1 0.1L4.4-51.1C-15.3-33.9-33.8-15.3-51.1 4.4l450.4 395c0 0 0 0.1-0.1 0.1L-99 66.6c-14.5 21.7-27.6 44.4-39.3 68l537.4 265c0 0 0 0.1 0 0.1l-567.4-192.6c-8.3 24.6-15.1 49.9-20.2 75.8L399 399.8c0 0 0 0.1 0 0.1l-597.7-39.2c-1.7 26.5-1.7 52.7-0.1 78.5L399 400.1c0 0 0 0.1 0 0.1l-587.6 116.9c5.1 25.9 11.9 51.2 20.3 75.8l567.4-192.6c0 0 0 0.1 0 0.1l-537.3 265c11.6 23.5 24.8 46.2 39.3 67.9l498.1-332.8c0 0 0 0.1 0.1 0.1l-450.4 395c17.3 19.7 35.8 38.2 55.5 55.5l395-450.4c0 0 0.1 0 0.1 0.1L66.6 899c21.7 14.5 44.4 27.6 68 39.3l265-537.4c0 0 0.1 0 0.1 0L207.1 968.3c24.6 8.3 49.9 15.1 75.8 20.2L399.8 401c0 0 0.1 0 0.1 0l-39.2 597.7c26.5 1.7 52.7 1.7 78.5 0.1L400.1 401c0 0 0.1 0 0.1 0l116.9 587.6c25.9-5.1 51.2-11.9 75.8-20.3L400.3 400.9c0 0 0.1 0 0.1 0l265 537.3c23.5-11.6 46.2-24.8 67.9-39.3L400.5 400.8c0 0 0.1 0 0.1-0.1l395 450.4c19.7-17.3 38.2-35.8 55.5-55.5l-450.4-395c0 0 0-0.1 0.1-0.1L899 733.4c14.5-21.7 27.6-44.4 39.3-68l-537.4-265c0 0 0-0.1 0-0.1l567.4 192.6c8.3-24.6 15.1-49.9 20.2-75.8L401 400.2c0 0 0-0.1 0-0.1L998.7 439.2z'/></g></svg>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '550px',
              height: '630px',
              padding: '15px',
              paddingBottom: '35px'
            }}
          >
            <img style={{borderRadius: '10px', transformOrigin: '50% 100%', transform: 'scale(2)'}} src={startPage.thumbnail.source} width={startPage.thumbnail.width} height={startPage.thumbnail.height} alt="The thumbnail of start page" />
            <div
              style={{
                display: 'flex',
                height: '220px',
                width: '495px',
                justifyContent: 'center',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              {startPage.title}
            </div>
          </div>
            <svg style={{margin: '25px'}} width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="M11.3 19.3q-.275-.275-.288-.7q-.012-.425.263-.7l4.9-4.9H5q-.425 0-.713-.288Q4 12.425 4 12t.287-.713Q4.575 11 5 11h11.175l-4.9-4.9q-.275-.275-.263-.7q.013-.425.288-.7q.275-.275.7-.275q.425 0 .7.275l6.6 6.6q.15.125.213.312q.062.188.062.388t-.062.375q-.063.175-.213.325l-6.6 6.6q-.275.275-.7.275q-.425 0-.7-.275Z"/></svg>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '550px',
              height: '630px',
              padding: '15px',
              paddingBottom: '35px'
            }}
          >
            <img style={{borderRadius: '10px', transformOrigin: '50% 100%', transform: 'scale(2)'}} src={endPage.thumbnail.source} width={endPage.thumbnail.width} height={endPage.thumbnail.height} alt="The thumbnail of end page" />
            <div
              style={{
                display: 'flex',
                height: '220px',
                width: '495px',
                justifyContent: 'center',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              {endPage.title}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image : ${e}`, {
      status: 500
    });
  }
}

interface WikiRawPreview  {
  ns: number,
  pageid: number,
  index: number, 
  title: string, 
  description: string
  thumbnail: {
    source: string,
    width: number,
    height: number
  }
  missing?: string
}

interface WikiPreviewResponse {
  query: {
    pages: WikiRawPreview[]
  }
}