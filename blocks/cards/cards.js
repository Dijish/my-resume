import { fetchPlaceholders, createOptimizedPicture, toCamelCase } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  ul.querySelectorAll('a').forEach(a => {
    let pKey = toCamelCase(a.innerText);
    if (placeholders[pKey]) {
      a.innerText = placeholders[pKey];
    }
  });
  
  block.textContent = '';
  block.append(ul);
}
