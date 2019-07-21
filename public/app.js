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
      articleElement += `<p class="article-link">${data[i].link} </p>`;
    } else {
      articleElement += `<p class="article-link--unavailable"> (Link Not Available) </p>`;
    }
    articleElement +="</div>"
    $("#articles").append(articleElement);
  }
});

$(document).on("click", ".article-save", function(){
  console.log("Button was clicked");
  var idToSave = $(this).parent().attr("data-id");
  console.log(idToSave);

  // Now make an ajax call for the Article
  $.ajax({
      method: "PUT",
      url: "/articles/" + idToSave,
    }).then(function(data){

    });
});

$("#scrape").on("click", function(event) {
  event.preventDefault()
  console.log("....Gathering the news!");
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function (data) {
  })
})

$("#nav-saved").on("click", function(){
  event.preventDefault();
  console.log("...finding saved articles");
  $.ajax({
    method: "GET",
    url: "/saved"
  }).then(function(data){
    console.log(data);
  });
});


// Reference Code Below:
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// When you click the savenote button
// $(document).on("click", "#savenote", function () {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//       method: "POST",
//       url: "/articles/" + thisId,
//       data: {
//         // Value taken from title input
//         title: $("#titleinput").val(),
//         // Value taken from note textarea
//         body: $("#bodyinput").val()
//       }
//     })
//     // With that done
//     .then(function (data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });
// // Whenever someone clicks a p tag
// $("document").on("click", "p", function () {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//       method: "GET",
//       url: "/articles/" + thisId
//     })
//     // With that done, add the note information to the page
//     .then(function (data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });