var subreddit = 'memes';
var sort_by = 'new';
var sort_time = 'all';
var save_dir = 'default';
var limit = '1';
var after = ""
url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
console.log(url);


data = [];

i = 0;

function getImg(now) {

    var imgs = []
    if ("preview" in now) {
        for (x in now["preview"]["images"]) {
            imgs.push(now["preview"]["images"][x]["source"]["url"]);
        }
    }
    if ("media_metadata" in now) {
        for (x in now["media_metadata"]) {
            imgs.push(now["media_metadata"][x]["s"]["u"]);
        }
    }
    //if ("url_overridden_by_dest" in now) {
    //    document.getElementById("img").innerHTML = "<img src='" + now["url_overridden_by_dest"] + "' width='100%' height='100%'></img>";
    //}//url_overridden_by_dest
    return imgs
}

async function load(now, title, text, img) {

    title.innerText = now["title"];
    text.innerHTML = now["selftext_html"];
    img.innerHTML = ""

    if (now["is_video"]) {
        img.innerHTML = "<video src='" + now["media"]["reddit_video"]["fallback_url"] + "' autoplay controls width='100%' height='100%' alt='loading...'></video>";
    } else {
        g=getImg(now);
        console.log(g);
        
        for (x in g) {
            console.log(x);
            img.innerHTML += "<img src='" + g[x] + "' width='100%' height='100%' alt='bild'></img>";
        }
    }
}

async function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function () {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
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
    preloadImages(getImg(now));
}

type = "watching"
function change() {
    if (type == "watching") {
        document.getElementById("Post").style.display = "none";
        document.getElementById("next").style.display = "none";
        document.getElementById("change").innerText = "Fertig";
        document.getElementById("options").style.display = "unset";
        document.getElementById("showingType").value = sort_by;
        document.getElementById("community").value = subreddit;
        type = "changeing"
    } else if (type == "changeing") {
        document.getElementById("Post").style.display = "unset";
        document.getElementById("next").style.display = "unset";
        document.getElementById("options").style.display = "none";
        document.getElementById("change").innerText = "Verändern"
        sort_byO = sort_by;
        sort_by = document.getElementById("showingType").value;
        subredditO=subreddit;
        subreddit=document.getElementById("community").value;
        type = "watching";
        if (sort_byO != sort_by) {
            after = "";
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            console.log(url);
            get(1);
        }
        if (subredditO != subreddit) {
            after = "";
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            console.log(url);
            get(1);
        }
    }
}