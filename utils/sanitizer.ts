import sanitizeHtml from 'sanitize-html';

export function sanitizeReconstructedHtml(rawHtml: string): string {
  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: [
      'html', 'head', 'body', 'meta', 'style', 'title', 'link',
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'ul', 'ol', 'li', 'a', 'img', 'b', 'i', 'strong', 'em', 'br', 'hr',
      'marquee', 'blink', 'center', 'font'
    ],
    allowedAttributes: {
      '*': ['id', 'class', 'style', 'align', 'bgcolor', 'color', 'size', 'face', 'width', 'height', 'border', 'cellpadding', 'cellspacing', 'href', 'src', 'alt', 'target', 'behavior', 'direction', 'scrollamount'],
      'meta': ['charset', 'name', 'content'],
      'link': ['rel', 'href', 'type']
    },
    allowedStyles: {
      '*': {
        'color': [/^#/],
        'background-color': [/^#/],
        'background': [/.*/],
        'font-family': [/.*/],
        'font-size': [/.*/],
        'text-align': [/.*/],
        'border': [/.*/],
        'margin': [/.*/],
        'padding': [/.*/],
        'width': [/.*/],
        'height': [/.*/],
        'display': [/.*/],
        'flex-direction': [/.*/],
        'grid-template-columns': [/.*/],
        'text-shadow': [/.*/],
        'box-shadow': [/.*/],
        'animation': [/.*/]
      }
    },
    parser: {
      lowerCaseTags: true
    }
  });

  if (!cleanHtml.toLowerCase().includes('<html')) {
    return `<!DOCTYPE html>\n<html>\n${cleanHtml}\n</html>`;
  }
  return `<!DOCTYPE html>\n${cleanHtml}`;
}