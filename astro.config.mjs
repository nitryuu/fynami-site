// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import solidJs from "@astrojs/solid-js";

function rehypeExternalLinks() {
  return (tree) => {
    function transform(node, parent, index) {
      if (node.tagName === 'a' && node.properties?.href?.startsWith('http')) {
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }

      if (node.tagName === 'th') {
        node.properties = node.properties || {};
        const className = node.properties.className || [];
        if (!className.includes('min-w-[200px]')) className.push('min-w-[200px]');
        node.properties.className = className;
      }
      
      if (node.tagName === 'table' && parent && typeof index === 'number') {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['overflow-x-auto'] },
          children: [node],
        };
      }
      
      if (node.children) {
        node.children.forEach((child, i) =>
          transform(child, node, i)
        );
      }
    }
    
    if (tree.children) {
      tree.children.forEach((child, i) =>
        transform(child, tree, i)
      );
    }
  };
}

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [solidJs()],
  markdown: {
    rehypePlugins: [rehypeExternalLinks]
  } 
});
