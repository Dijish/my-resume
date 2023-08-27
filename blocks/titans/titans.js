export default function decorate(block) {
    fetchTitans(block, 0);
}

const fetchTitans = (block, offset) => {
    const section = block.closest('.section');
    const limit = parseInt(section?.dataset?.limit || '0');
    fetch(`/day5json.json?offset=${offset < 0 ? 0 : offset}${limit ? '&limit=' + limit : ''}`).then((response) => {
        return response.json();
    }).then((data) => {
        if(data.data.length > 0){
            window.offset = data.offset;

            let div;
            if (block.querySelector('.titan__results')) {
                div = block.querySelector('.titan__results');
                div.innerHTML = '';
            } else {
                const divWrapper = document.createElement('div');
                divWrapper.classList.add('titan__results');
                div = divWrapper;
            }

            const ol = document.createElement('ol');
            data.data.forEach((item) => {
                const li = document.createElement('li');
                li.innerHTML = `<p>${item.Character} ---> ${item.Titan}</p>`;
                ol.append(li);
            });
            div.append(ol);

            if (!block.querySelector('.titan__results')) block.append(div);

            if (!block.querySelector('button')) {
                const nextButton = document.createElement('button');
                nextButton.classList.add('title__next');
                nextButton.innerHTML = 'Next';
                nextButton.addEventListener('click', function() {
                    fetchTitans(block, window.offset + limit);
                });
                block.append(nextButton);

                const prevButton = document.createElement('button');
                prevButton.classList.add('title__prev');
                prevButton.innerHTML = 'Previous';
                prevButton.addEventListener('click', () => {
                    fetchTitans(block, window.offset - limit);
                });
                prevButton.setAttribute('disabled', true);
                block.append(prevButton);
            } else {
                const nextButton = block.querySelector('button.title__next');
                if (data.total === (window.offset + data.limit)) nextButton.setAttribute('disabled', true);
                else nextButton.removeAttribute('disabled');

                const prevButton = block.querySelector('button.title__prev');
                if (data.offset === 0)  prevButton.setAttribute('disabled', true);
                else prevButton.removeAttribute('disabled');
            }

        }
    });
}