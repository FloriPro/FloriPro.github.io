var after = "t5_2qh7f";
var url = "";
var onlyNSFW = document.querySelector("#onlyNSFW").checked;

function makeUrl() {
    //popular, new, gold, default
    url = "https://www.reddit.com/subreddits/popular/.json?show=all&limit=100&after=" + after
}

function get() {
    makeUrl();
    $.getJSON(url,
        function (json) {
            console.log(json)
            onlyNSFW = document.querySelector("#onlyNSFW").checked;
            after = json.data.after;
            for (var subreddit of json.data.children) {
                console.log(subreddit.data.over18);
                //if (!onlyNSFW || subreddit.data.over18) {
                //console.log(subreddit.data.title);
                //}
            }
            //get()
        });
}

get();