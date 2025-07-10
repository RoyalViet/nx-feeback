import sanitizeHtml, { IOptions } from 'sanitize-html';

export function sanitizeHtmlFn(content: string, options?: IOptions) {
  try {
    return sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'img',
        'oembed',
        'iframe',
      ]),
      allowedAttributes: false,
      transformTags: {
        figure: (tagName, attribs) => {
          return {
            tagName: 'div',
            attribs: {
              style:
                attribs['class'] === 'media'
                  ? 'position: relative; overflow: hidden; width: 100%; padding-top: 56.25%;'
                  : '',
            },
          };
        },
        img: (tagName, attribs) => {
          return {
            tagName: 'img',
            attribs: {
              src: attribs['src'],
              style: 'position: relative; overflow: hidden; max-width: 100%;',
            },
          };
        },
        oembed: (tagName, attribs) => {
          const regExp =
            // eslint-disable-next-line no-useless-escape
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = attribs['url'].match(regExp);
          let embedUrl = attribs['url'];
          if (match && match[2].length === 11) {
            // eslint-disable-next-line prefer-template
            embedUrl = '//www.youtube.com/embed/' + match[2];
          }
          return {
            tagName: 'iframe',
            attribs: {
              style:
                'position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%;',
              frameborder: '0',
              allow:
                'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
              allowfullscreen: 'false',
              src: embedUrl,
            },
          };
        },
        a: (tagName, attribs) => {
          return {
            tagName: 'a',
            attribs: {
              class: attribs['class'],
              style: attribs['style'] || '',
              href: attribs['href'],
              target: '_blank',
            },
          };
        },
      },
      ...options,
    });
  } catch (e) {
    return sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: false,
    });
  }
}
