// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Build the element to be displayed on the page
    let articleElement = "<div class='article-wrapper'>";
    // Add the article headline
    articleElement += "<p class ='article-headline' data-id='" + data[i]._id + "'>" + data[i].title
    // Add a 'save' button
    articleElement += "<button class='btn btn-secondary article-save' style='float: right;'>Save</button></p>"
    // Video articles don't have a link and instead show 'javascript:void(0)
    // This block handles that condition
    if(data[i].link != "javascript:void(0);") {
      articleElement += `<a class="article-link" href=${data[i].link}>${data[i].link} </p>`;
    } else {
      articleElement += `<p class="article-link--unavailable"> (Link Not Available) </p>`;
    }
    articleElement +="</div>"
    $("#articles").append(articleElement);
  }
});
