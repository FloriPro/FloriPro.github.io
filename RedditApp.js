var subreddit = 'Minecraft';
var sort_by = 'new';
var sort_time = 'all';
var save_dir = 'default';
var limit = '1';
var after = ""

//load data
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("subreddit") != null) { subreddit = urlParams.get("subreddit"); }
if (urlParams.get("after") != null) { after = urlParams.get("after"); }

url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;

var afterList = [];
data = [];

i = 0;

function getImg(now) {

    var imgs = [];
    //if ("preview" in now) {
    //    for (x in now["preview"]["images"]) {
    //        imgs.push(now["preview"]["images"][x]["source"]["url"]);
    //    }
    //}
    if ("media_metadata" in now) {
        for (x in now["media_metadata"]) {
            imgs.push(now["media_metadata"][x]["s"]["u"]);
        }
    }
    if ("url" in now) {
        if (!now["url"].match(/.(jpg|jpeg|png|gif)$/i)) {} else {
            imgs.push(now["url"]);
        }
    } //url_overridden_by_dest
    return imgs
}
loaded = 0;
async function load(now, title, text, img) {

    title.innerText = now["title"];
    link = "https://reddit.com" + now["permalink"]
    if (now["selftext_html"] != null) { selftext = now["selftext_html"] } else { selftext = "" }
    text.innerHTML = selftext + "<a target='_blank' href='" + link + "'>reddit.com</p>";
    img.innerHTML = ""
    if (now["media"] != null) {
        if ("oembed" in now["media"]) {
            img.innerHTML += now["media"]["oembed"]["html"]
        }
    }
    if (now["is_video"]) {
        if ("reddit_video" in now["media"]) {
            audio = now["media"]["reddit_video"]["fallback_url"];
            audio = audio.substring(0, audio.indexOf('DASH'));
            audio = audio + "DASH_audio.mp4?source=fallback";
            img.innerHTML += "<video id='video_video' controls width='100%' height='100%' alt='loading...'><source src='" + now["media"]["reddit_video"]["fallback_url"] + "'></video>";
            img.innerHTML += "<video id='video_audio' controls width='0%' height='0%' alt='loading...'><source src='" + audio + "'></video>";
            video_video = document.getElementById("video_video");
            video_audio = document.getElementById("video_audio");

            //wait until load
            video_video.addEventListener('loadeddata', function() {
                loaded += 1;
                if (loaded == 2) {
                    video_video.play();
                    video_video.addEventListener('play', videoPausePlayHandler, false);
                    video_video.addEventListener('pause', videoPausePlayHandler, false);
                    video_video.addEventListener('seeking', videoPausePlayHandler, false);
                    video_video.addEventListener('waiting', videoPausePlayHandler, false);
                    video_video.addEventListener('canplay', videoPausePlayHandler, false);
                }
            }, false);
            video_audio.addEventListener('loadeddata', function() {
                loaded += 1;
                if (loaded == 2) {
                    video_video.play();
                    video_video.addEventListener('play', videoPausePlayHandler, false);
                    video_video.addEventListener('pause', videoPausePlayHandler, false);
                    video_video.addEventListener('seeking', videoPausePlayHandler, false);
                    video_video.addEventListener('waiting', videoPausePlayHandler, false);
                    video_video.addEventListener('canplay', videoPausePlayHandler, false);
                }
            }, false);
        }
    }
    g = getImg(now);

    for (x in g) {
        img.innerHTML += "<img src='" + g[x] + "' width='100%' height='100%' alt='bild'></img>";
    }
}

function videoPausePlayHandler(e) {
    video_audio.currentTime = video_video.currentTime;
    if (e.type == 'play') {
        video_audio.play();
    } else if (e.type == 'pause') {
        video_audio.pause();
    } else if (e.type == 'waiting') {
        video_audio.pause();
    } else if (e.type == 'canplay') {
        if (!video_video.paused) { video_audio.play(); }
    }
}

async function preloadImages(urls) {
    console.log(urls);
    var loadedCounter = 0;
    var toBeLoadedNumber = urls.length;
    urls.forEach(function(url) {
        preloadImage(url, function() {
            loadedCounter++;
            console.log('Number of loaded images: ' + loadedCounter);
        });
    });

    function preloadImage(url, anImageLoadedCallback) {
        var img = new Image();
        img.onload = anImageLoadedCallback;
        img.src = url;
    }
}

async function get(i) {
    $.getJSON(url, function(json) {
        after = json["data"]["after"];

        j = json;

        now = json["data"]["children"][0]["data"];

        preloadImages(getImg(now));

        if (i == 1) {
            afterO = after
            title = document.getElementById("title")
            text = document.getElementById("text")
            img = document.getElementById("img")
            load(now, title, text, img);
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            get(0)
        }
        if (i == 2) {
            afterO = after
            title = document.getElementById("title")
            text = document.getElementById("text")
            img = document.getElementById("img")
            load(now, title, text, img);
            //url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            get(0)
        }
        //show
        //document.getElementById("img").innerText=
    });
}
if (after == "") {
    get(1)
} else {
    url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
    get(2);
}
afterList = []

function next() {
    loaded = 0;
    i++;
    title = document.getElementById("title")
    text = document.getElementById("text")
    img = document.getElementById("img")

    //set "subreddit" and after
    let newUrlIS = window.location.origin + window.location.pathname + '?subreddit=' + subreddit + "&after=" + afterO;
    history.pushState({}, null, newUrlIS);

    //back
    afterList.push(afterO);
    if (afterList.length > 15) {
        afterList.shift();
    }

    //show and load new
    load(now, title, text, img);
    url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
    afterO = after
    get(0)

    window.scrollTo(0, 0);
}

function back() {
    afterO = afterList[afterList.length - 2];
    after = afterList[afterList.length - 1];
    afterList.pop();

    let newUrlIS = window.location.origin + window.location.pathname + '?subreddit=' + subreddit + "&after=" + afterO;
    history.pushState({}, null, newUrlIS);

    url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + afterO;
    get(1);
}

type = "watching"

function change() {
    if (type == "watching") {
        document.getElementById("Post").style.display = "none";
        document.getElementById("buttons").style.display = "none";
        document.getElementById("change").innerText = "Fertig";
        document.getElementById("options").style.display = "unset";
        document.getElementById("showingType").value = sort_by;
        document.getElementById("community").value = subreddit;
        type = "changeing"
    } else if (type == "changeing") {
        document.getElementById("Post").style.display = "unset";
        document.getElementById("buttons").style.display = "inline-table";
        document.getElementById("options").style.display = "none";
        document.getElementById("change").innerText = "Ver�ndern"
        sort_byO = sort_by;
        sort_by = document.getElementById("showingType").value;
        subredditO = subreddit;
        subreddit = document.getElementById("community").value;
        type = "watching";
        if (sort_byO != sort_by) {
            after = "";
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            get(1);
        }
        if (subredditO != subreddit) {
            after = "";
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            get(1);
        }
    }
}