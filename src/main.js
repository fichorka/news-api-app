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
$("#search").attr("value", decodeURIComponent(searchTerm.replace(/\+/g, ' ')));

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

// slider buttons event handler
function slide(direction) {
	let selected = currentArticle + direction;
	if (selected > domArticles.length - 1) {
		selected = 0;
	} else if (selected < 0) {
		selected = domArticles.length - 1;
	}
	domArticles.forEach((article, index) => {
		if (index == selected) {
			article.attr("style", "display: block");
		} else article.attr("style", "display: none");
	});
	currentArticle = selected;
}

function createList() {
	const $articleMap = articles.map(article => {
		const articleElement = $("<article></article>");
		articleElement.attr("class", "article-container");
		domArticles.push(articleElement);

		// image
		const $imageContainer = $("<div></div>");
		$imageContainer.attr("class", "image-container");
		const $image = $("<img>");
		const imagePath = article.urlToImage || "assets/placeholder.jpg";
		$image.attr({
			src: imagePath,
			class: "article-image",
			oneerror: "onerror='this.onerror=null';this.src='assets/placeholder.jpg';"
		});
		$imageContainer.append($image);
		articleElement.append($imageContainer);

		// text
		if (article.title) {
			const $textContainer = $("<div></div>");
			$textContainer.attr("class", "text-container");
			const title = article.title;
			const $heading = $("<h1><-h1>");
			$heading.attr("class", "article-heading");
			$heading.text(title);
			$textContainer.append($heading);

			if (article.author) {
				const label = `Autor: ${article.author}`;
				const $authorElement = $("<span></span>");
				$authorElement.attr("class", "article-author");
				$authorElement.append(label);
				$textContainer.append($authorElement);
			}

			if (article.description) {
				const $trimmedText = article.description.split(" ").splice(0, 50).join(" ");
				const $description = $("<p></p>");
				$description.text($trimmedText);
				$description.attr("class", "article-description"); 
				$textContainer.append($description);
			}

			if (article.url) {
				const label = "Pročitaj članak";
				const $linkElement = $("<a></a>");
				$linkElement.attr("href", article.url);
				$linkElement.attr("class", "article-link");
				$linkElement.append(label);
				$textContainer.append($linkElement);
			}

			articleElement.append($textContainer);
		}
		
		return articleElement;
	});

	const $displayContainer = $("<div></div>");
	$displayContainer.attr("class", "display-container");
	$articleMap.forEach(article => {
		$displayContainer.prepend(article);
	});

	$("#sliderApp").append($displayContainer);
}