var after = "t5_2qh7f";
var url = "";
function makeUrl() {
    //popular, new, gold, default
    url = "https://www.reddit.com/subreddits/popular/.json?show=all&limit=10&after=" + after
}

function get() {
    makeUrl();
    $.getJSON(url,
        function (json) {
            console.log(json)
            after = json.data.after;
            for (var subreddit of json.data.children) {
                document.querySelector("#subredditList").innerHTML += `<p>` + subreddit.data.title + `</p>`
                //if (!onlyNSFW || subreddit.data.over18) {
                //console.log(subreddit.data.title);
                //}
            }
            //get()
        });
}

get();