var apiKey = "api_key=KrjKqyFmOuhu3Bp6WbWi8BXmLbD0gANz";
var topics = ["Rick and Morty", "Robot Chicken", "Steve Bruhle", "Batman", "Game of Thrones", "Westworld", "The Good Place", "The Office", "Django", "Inglorious Basterds", "The Matrix", "Star Wars", "Lord of the Rings", "Blade Runner", "Cowboy Bebop", "Fullmetal Alchemist", "Dragon Ball", "The Last of Us", "Mass Effect", "The Legend of Zelda", "George Carlin"];
var favorites = [];
var sameBtnCount = 0;
var prevBtn = "";

// Get locally stored favorites
var localCheck = localStorage.getItem("favorites");
var lastComma = 0;
if (localCheck != null) {
    for (i = 0; i < localCheck.length; i++) { 
        if (localCheck[i] == ",") {
            var item = localCheck.slice(lastComma, i);
            favorites.push(item);
            lastComma = i + 1;
        };
        if  (i == localCheck.length - 1) {
            var item = localCheck.slice(lastComma, localCheck.length);
            favorites.push(item);
            lastComma = 0;
        };
    };
}

// Display intial topic buttons
for (var i = 0; i < topics.length; i++) {
    var btn = $("<button>").attr("class", "btn");
    btn.text(topics[i]);
    $("#buttons").append(btn);
};

// Topic button click
$(document.body).on("click", ".btn", function() {
    $("#gifs").empty();

    if ($(this).text() == prevBtn) {
        sameBtnCount += 10;
    }
    else {
        sameBtnCount = 0;
    };
    prevBtn = $(this).text();

    var queryURL = "https://api.giphy.com/v1/gifs/search?" + apiKey + "&q=" + $(this).text() + "&limit=10" + "&offset= " + sameBtnCount;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var results = response.data;

        for (var i = 0; i < results.length; i++) {
            var gifDIV = $("<div>").attr("class", "gifDIV");
            var image = $("<img>").attr("class", "gif");
            image.attr("src", results[i].images.fixed_height_still.url);
            image.attr("data-still", results[i].images.fixed_height_still.url);
            image.attr("data-animate", results[i].images.fixed_height.url);
            image.attr("data-state", "still");
            var title = $("<p>");
            title.text("Title: " + results[i].title);
            var rating = $("<p>");
            rating.text("Rating: " + results[i].rating);
            var favBtn = $("<button>").attr("class", "favorite");
            favBtn.text("Add to Favorites");
            favBtn.attr("data-id", results[i].id);
            gifDIV.append(image);
            gifDIV.append(title);
            gifDIV.append(rating);
            gifDIV.append(favBtn);
            $("#gifs").prepend(gifDIV);
        };
    });
});

// Gif image click
$(document.body).on("click", ".gif", function() {
    var state = $(this).attr("data-state");
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    }
    else if (state === "animate") {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    };
});

// Favorite button click
$(document.body).on("click", ".favorite", function() {
    favorites.push($(this).attr("data-id"));
    localStorage.clear();
    localStorage.setItem("favorites", favorites);
});

// Unfavorite button click
$(document.body).on("click", ".unfavorite", function() {
    for (var i = 0; i < favorites.length; i++) {
        if (favorites[i] == $(this).attr("data-id")) {
            favorites.splice(i, 1);
            break;
        }
    }

    $("#gifs").empty();

    for (var i = 0; i < favorites.length; i++) {
        var queryURL = "https://api.giphy.com/v1/gifs/" + favorites[i] + "?" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var result = response.data;

            var gifDIV = $("<div>").attr("class", "gifDIV");
            var image = $("<img>").attr("class", "gif");
            image.attr("src", result.images.fixed_height_still.url);
            image.attr("data-still", result.images.fixed_height_still.url);
            image.attr("data-animate", result.images.fixed_height.url);
            image.attr("data-state", "still");
            var title = $("<p>");
            title.text("Title: " + result.title);
            var rating = $("<p>");
            rating.text("Rating: " + result.rating);
            var favBtn = $("<button>").attr("class", "unfavorite");
            favBtn.text("Remove from Favorites");
            favBtn.attr("data-id", result.id);
            gifDIV.append(image);
            gifDIV.append(title);
            gifDIV.append(rating);
            gifDIV.append(favBtn);
            $("#gifs").prepend(gifDIV);
        });
    }
    
    localStorage.clear();
    localStorage.setItem("favorites", favorites);
});

// Add topic click
$("#addGiphy").on("click", function(event) {
    event.preventDefault();

    var topic = $("#giphy-input").val().trim();
    if (topic != "") {
        topics.push(topic);

        $("#buttons").empty();

        for (var i = 0; i < topics.length; i++) {
            var btn = $("<button>").attr("class", "btn");
            btn.text(topics[i]);
            $("#buttons").append(btn);
        };
    };
});

// Display favorites button click
$("#favorites").on("click", function() {
    prevBtn = "";
    $("#gifs").empty();

    for (var i = 0; i < favorites.length; i++) {
        var queryURL = "https://api.giphy.com/v1/gifs/" + favorites[i] + "?" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var result = response.data;

            var gifDIV = $("<div>").attr("class", "gifDIV");
            var image = $("<img>").attr("class", "gif");
            image.attr("src", result.images.fixed_height_still.url);
            image.attr("data-still", result.images.fixed_height_still.url);
            image.attr("data-animate", result.images.fixed_height.url);
            image.attr("data-state", "still");
            var title = $("<p>");
            title.text("Title: " + result.title);
            var rating = $("<p>");
            rating.text("Rating: " + result.rating);
            var favBtn = $("<button>").attr("class", "unfavorite");
            favBtn.text("Remove from Favorites");
            favBtn.attr("data-id", result.id);
            gifDIV.append(image);
            gifDIV.append(title);
            gifDIV.append(rating);
            gifDIV.append(favBtn);
            $("#gifs").prepend(gifDIV);
        });
    }
});