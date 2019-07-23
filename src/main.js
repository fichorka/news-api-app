const apiKey = '42c3dd6dfe8f4866a23ad70d71cd3c66';
let searchTerm = '';
let domArticles = [];
let currentArticle = 0;

// checking for search query:
if (window.location.search.length) {
	const regularExp = new RegExp(/\?search=([^&]+)/);
	const testTerm = regularExp.exec(window.location.search) || '';
	searchTerm = testTerm.length > 1 ? testTerm[1] : '';
}

// set input field value:
$("#search").val(decodeURIComponent(searchTerm.replace(/\+/g, ' ')));

// api request:
const url = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${apiKey}`;
const req = new Request(url);
if (searchTerm) {
	fetch(req)
		.then(response => (response.json()))
		.then(json => (json.articles.slice(0, 5) ))
		.then(articles => createList(articles));
} else {
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
	domArticles.forEach(($article, index) => {
		if (index == selected) {
			$article.attr("style", "display: block");
		} else $article.attr("style", "display: none");
	});
	currentArticle = selected;
}

function createList(articles = []) {
	articles = articles.length ? articles : [{default: "df"}]
	// debugger;
	const articleMap = articles.map(article => {
		const $articleElement = $("<article></article>");
		$articleElement.attr("class", "article-container");
		domArticles.push($articleElement);

		//image
		const $imageContainer = $("<div></div>");
		$imageContainer.attr("class", "image-container");
		const $image = $("<img></img>");
		const imagePath = article.urlToImage || "assets/Placeholder.jpg";
		$image.attr("src", imagePath);
		$image.attr("class", "article-image");
		$image.attr("onerror", "onerror='this.onerror=null';this.src='assets/Placeholder.jpg';");
		$imageContainer.append($image);
		$articleElement.append($imageContainer);

		//text
		if (article.title) {
			const $textContainer = $("<div></div>");
			$textContainer.attr("class", "text-container");
			const title = article.title;
			const $heading = $("<h1></h1>");
			$heading.attr("class", "article-heading");
			$heading.text(title);
			$textContainer.append($heading);

			if (article.author) {
				const author = `Autor: ${article.author}`;
				const $authorElement = $("<span></span>");
				$authorElement.attr("class", "article-author"),
				$authorElement.text(author);
				$textContainer.append($authorElement);
			}

			if (article.description) {
				const trimmedText = article.description.split(" ").splice(0, 50).join(" ");
				const $descriptionElement = $("<p></p>");
				$descriptionElement.append(trimmedText);
				$descriptionElement.attr("class", "article-description");
				$textContainer.append($descriptionElement);
			}

			if (article.url) {
				const linkText = "Pročitaj članak";
				const $linkElement = $("<a></a>");
				$linkElement.attr("href", article.url);
				$linkElement.attr("class", "article-link");
				$linkElement.text(linkText);
				$textContainer.append($linkElement);
			}

			$articleElement.append($textContainer);
		}
		return $articleElement;
	});

	const $displayContainer = $("<div></div>");
	$displayContainer.attr("class", "display-container");
	articleMap.forEach(article => {
		$displayContainer.append(article);
	});

	$("#sliderApp").append($displayContainer);
}