var subreddit = 'memes';
var sort_by = 'hot';
var sort_time = 'all';
var save_dir = 'default';
var limit = '1';
var after = ""
url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
console.log(url);


data = [];

i = 0;

async function load(now, title, text, img) {

    title.innerText = now["title"];
    text.innerHTML = now["selftext_html"];
    img.innerHTML = ""

    if (now["is_video"]) {
        img.innerHTML = "<video src='" + now["media"]["reddit_video"]["fallback_url"] + "' autoplay controls width='100%' height='100%' alt='loading...'></video>";
    } else {
        if ("preview" in now) {
            for (x in now["preview"]["images"]) {
                img.innerHTML += "<img src='" + now["preview"]["images"][x]["source"]["url"] + "' width='100%' height='100%' alt='loading...'></img>";
            }
        }
        if ("media_metadata" in now) {
            for (x in now["media_metadata"]) {
                img.innerHTML += "<img src='" + now["media_metadata"][x]["s"]["u"] + "' width='100%' height='100%' alt='loading...'></img>";
            }
        }
        //if ("url_overridden_by_dest" in now) {
        //    document.getElementById("img").innerHTML = "<img src='" + now["url_overridden_by_dest"] + "' width='100%' height='100%'></img>";
        //}//url_overridden_by_dest
    }
}

async function get(i) {
    $.getJSON(url, function (json) {
        console.log(json["data"]);
        after = json["data"]["after"];
        j = json;

        now = json["data"]["children"][0]["data"];

        if (i == 1) {
            title = document.getElementById("title")
            text = document.getElementById("text")
            img = document.getElementById("img")
            load(now, title, text, img);
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            get(0)
        }
        //show
        //document.getElementById("img").innerText=
    });
}
get(1)
async function next() {
    i++;
    title = document.getElementById("title")
    text = document.getElementById("text")
    img = document.getElementById("img")
    load(now, title, text, img);
    url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
    get(0)
}

type = "watching"
function change() {
    if (type == "watching") {
        document.getElementById("Post").style.display = "none";
        document.getElementById("next").style.display = "none";
        document.getElementById("change").innerText = "Fertig";
        document.getElementById("options").style.display = "unset";
        document.getElementById("showingType").value = sort_by;
        type = "changeing"
    } else if (type == "changeing") {
        document.getElementById("Post").style.display = "unset";
        document.getElementById("next").style.display = "unset";
        document.getElementById("options").style.display = "none";
        document.getElementById("change").innerText = "Verändern"
        sort_byO = sort_by;
        sort_by = document.getElementById("showingType").value;
        type = "watching";
        if (sort_byO != sort_by) {
            after = "";
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            console.log(url);
            get(1);
        }
    }
}