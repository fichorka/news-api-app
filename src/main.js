const apiKey = '42c3dd6dfe8f4866a23ad70d71cd3c66';
let searchTerm = '';
let domArticles = [];
let currentArticle = 0;
let articles = null;

// checking for search query:
if (window.location.search.length) {
	const regularExp = new RegExp(/\?search=([^&]+)/);
	const testTerm = regularExp.exec(window.location.search) || '';
	const term = testTerm.length > 1 ? testTerm[1] : '';
	searchTerm = term;
}

// set input field value:
document.getElementById("search").value = decodeURIComponent(searchTerm.replace(/\+/g, ' '));

// api request:
const url = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${apiKey}`;
const req = new Request(url);
if (searchTerm) {
	fetch(req)
		.then(response => (response.json()))
		.then(json => { articles = json.articles.slice(0, 5) })
		.then(createList);
} else {
	articles = [{}];
	createList();
}

//slide buttons event handler
function slide(direction) {
	let selected = currentArticle + direction;
	if (selected > domArticles.length - 1) {
		selected = 0;
	} else if (selected < 0) {
		selected = domArticles.length - 1;
	}
	domArticles.forEach((article, index) => {
		if (index == selected) {
			article.setAttribute("style", "display: block");
		} else article.setAttribute("style", "display: none");
	});
	currentArticle = selected;
}

function createList() {
	const articleMap = articles.map(article => {
		const articleElement = document.createElement("ARTICLE");
		articleElement.setAttribute("class", "article-container");
		domArticles.push(articleElement);

		//image
		const imageContainer = document.createElement("DIV");
		imageContainer.setAttribute("class", "image-container");
		const image = document.createElement("IMG");
		const imagePath = article.urlToImage || "assets/placeholder.jpg";
		image.setAttribute("src", imagePath);
		image.setAttribute("width", "30%");
		image.setAttribute("class", "article-image");
		image.setAttribute("onerror", "onerror='this.onerror=null';this.src='assets/placeholder.jpg';");
		imageContainer.appendChild(image);
		articleElement.appendChild(imageContainer);

		//text
		if (article.title) {
			const textContainer = document.createElement("DIV");
			textContainer.setAttribute("class", "text-container");
			const title = document.createTextNode(article.title);
			const heading = document.createElement("H1");
			heading.setAttribute("class", "article-heading");
			heading.appendChild(title);
			textContainer.appendChild(heading);

			if (article.author) {
				const textNode = document.createTextNode(`Autor: ${article.author}`);
				const authorElement = document.createElement("SPAN");
				authorElement.setAttribute("class", "article-author"),
				authorElement.appendChild(textNode);
				textContainer.appendChild(authorElement);
			}

			if (article.description) {
				const trimmedText = article.description.split(" ").splice(0, 50).join(" ");
				const textNode = document.createTextNode(trimmedText);
				const description = document.createElement("P");
				description.appendChild(textNode);
				description.setAttribute("class", "article-description");
				textContainer.appendChild(description);
			}

			if (article.url) {
				const textNode = document.createTextNode("Pročitaj članak");
				const linkElement = document.createElement("a");
				linkElement.setAttribute("href", article.url);
				linkElement.setAttribute("class", "article-link");
				linkElement.appendChild(textNode);
				textContainer.appendChild(linkElement);
			}

			articleElement.appendChild(textContainer);
		}
		return articleElement;
	});

	const displayContainer = document.createElement("DIV");
	displayContainer.setAttribute("class", "display-container");
	articleMap.forEach(article => {
		displayContainer.insertBefore(article, displayContainer.firstChild);
	});

	document.getElementById("sliderApp").appendChild(displayContainer);
}