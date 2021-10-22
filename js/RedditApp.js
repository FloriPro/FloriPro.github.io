var subreddit = 'memes';
var sort_by = 'hot';
var sort_time = 'all';
var save_dir = 'default';
var limit = '1';
var after = ""
var saveData = false;


video_audio = null
video_video = null

//load data
urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("subreddit") != null) {
    subreddit = urlParams.get("subreddit");
} else {
    su = getCookie("RedditSubreddit");
    if (su != null) {
        subreddit = su;
    }
}

if (urlParams.get("sort") != null) {
    sort_by = urlParams.get("sort");
} else {
    so = getCookie("RedditSort");
    if (so != null) {
        sort_by = so;
    }
}


if (urlParams.get("after") != null) {
    after = urlParams.get("after");
}
url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;

var afterList = [];
data = [];

i = 0;

function getCookie(name) {
    var dc,
        prefix,
        begin,
        end;
    dc = document.cookie;
    prefix = name + "=";
    begin = dc.indexOf("; " + prefix);
    end = dc.length;
    if (begin !== -1) {
        begin += 2;
    } else {
        begin = dc.indexOf(prefix);
        if (begin === -1 || begin !== 0) return null;
    }
    if (dc.indexOf(";", begin) !== -1) {
        end = dc.indexOf(";", begin);
    }
    return decodeURI(dc.substring(begin + prefix.length, end)).replace(/\"/g, '');
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}



function getImg(now) {

    var imgs = [];
    if ("media_metadata" in now) {
        for (x in now["media_metadata"]) {
            if (saveData == false) {
                imgs.push(now["media_metadata"][x]["s"]["u"]);
            } else {
                p = Math.round(now["media_metadata"][x]["p"].length / 4);
                //p = 4;
                imgs.push(now["media_metadata"][x]["p"][p]["u"]);
            }
        }
    }
    if ("preview" in now && saveData == true) {
        console.log(now)
        for (x in now["preview"]["images"]) {
            a = now["preview"]["images"][x]["resolutions"];
            p = Math.round(a.length / 4);

            imgs.push(a[p]["url"]);
        }
    } else if ("url" in now) {
        now["url"] = now["url"].replace("gifv", "jpg")
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
            img.innerHTML += "<audio id='video_audio' controls width='0%' height='0%' alt='loading...' playsinline=\"\" autoplay=\"\" muted=\"\"><source src='" + audio + "'></audio>";

            video_audio = document.getElementById("video_audio");
            video_video = document.getElementById("video_video");

            //wait until load
            video_video.addEventListener('loadeddata', function() {
                loaded += 1;
                if (loaded == 2) {
                    video_audio.muted = false;
                    video_video.addEventListener('pause', videoPausePlayHandler, false);
                    video_video.addEventListener('play', videoPausePlayHandler, false);
                    video_video.addEventListener('seeking', videoPausePlayHandler, false);
                    video_video.addEventListener('waiting', videoPausePlayHandler, false);
                    video_video.addEventListener('canplay', videoPausePlayHandler, false);
                }
            }, false);
            video_audio.addEventListener('loadeddata', function() {
                loaded += 1;
                if (loaded == 2) {
                    video_audio.muted = false;
                    video_video.addEventListener('pause', videoPausePlayHandler, false);
                    video_video.addEventListener('play', videoPausePlayHandler, false);
                    video_video.addEventListener('seeking', videoPausePlayHandler, false);
                    video_video.addEventListener('waiting', videoPausePlayHandler, false);
                    video_video.addEventListener('canplay', videoPausePlayHandler, false);
                }
            }, false);

        }
    }
    g = getImg(now);

    for (x in g) {
        img.innerHTML += "<img src='" + g[x] + "' width='100%' height='100%' alt='Bild(kann nicht angezeigt werden, wenn du das hier siehst)'></img>";
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
    var loadedCounter = 0;
    var toBeLoadedNumber = urls.length;
    urls.forEach(function(url) {
        preloadImage(url, function() {
            loadedCounter++;
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
    if (video_video != null) {
        video_video.remove()
        video_audio.remove()

        video_audio = null
        video_video = null

    }
    loaded = 0;
    i++;
    title = document.getElementById("title")
    text = document.getElementById("text")
    img = document.getElementById("img")

    //set "subreddit" and after
    setLoc(subreddit, afterO, sort_by)

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

    document.querySelector('#title').scrollIntoView({
        behavior: 'smooth'
    });
}

function setLoc(subredd, aft, sort_) {
    let newUrlIS = window.location.origin + window.location.pathname + '?page=' + urlParams.get("page") + '&subreddit=' + subredd + "&after=" + aft + "&sort=" + sort_;
    history.pushState({}, null, newUrlIS);
}

function back() {
    afterO = afterList[afterList.length - 2];
    after = afterList[afterList.length - 1];
    afterList.pop();

    setLoc(subreddit, afterO, sort_by)

    url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + afterO;
    get(1);
}

type = "watching"

function list() {
    document.getElementById("buttons").style.display = "none";
    i = 500
    if (document.getElementById("Post") != null) { document.getElementById("Post").remove(); }
    listLoadFunction(i);
}
async function listLoadFunction(i) {
    url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
    $.getJSON(url, function(json) {
        after = json["data"]["after"];
        j = json;
        now = json["data"]["children"][0]["data"];

        imgs = getImg(now)

        document.getElementById("postSection").innerHTML += "<div id='post_" + i + "'></div>";



        document.getElementById("post_" + i).innerHTML += "<p style='padding-bottom: 20%;'></p><h1 class='title'>" + now["title"] + "</h1>";
        document.getElementById("post_" + i).innerHTML += "<div class='text'><p>" + selftext + "</p></div>";
        if (now["selftext_html"] != null) { selftext = now["selftext_html"] } else { selftext = "" }
        for (x in imgs) {
            document.getElementById("post_" + i).innerHTML += "<img src='" + imgs[x] + "' width='100%' height='100%' alt='bild'></img>";;
        }



        //title = document.getElementById("post_" + i);
        //text = document.getElementById("post_" + i);
        //img = document.getElementById("post_" + i);



        if (now["selftext_html"] != null) { selftext = now["selftext_html"] } else { selftext = "" }
        text.innerHTML = selftext
        img.innerHTML = ""
        if (now["media"] != null) {
            if ("oembed" in now["media"]) {
                img.innerHTML += now["media"]["oembed"]["html"]
            }
        }
        if (i >= 0) { listLoadFunction(i - 1); }
    });
}


function updated() {
    setCookie("RedditSubreddit", subreddit, 365);
    setCookie("RedditSort", sort_by, 365);
}

updated()

function change() {
    if (type == "watching") {
        document.getElementById("Post").style.display = "none";
        document.getElementById("buttons").style.display = "none";
        document.getElementById("change").innerText = "Fertig";
        document.getElementById("options").style.display = "unset";
        document.getElementById("doAsList").style.display = "none";
        document.getElementById("showingType").value = sort_by;
        document.getElementById("community").value = subreddit;
        type = "changeing"
    } else if (type == "changeing") {
        document.getElementById("Post").style.display = "unset";
        document.getElementById("buttons").style.display = "inline-table";
        document.getElementById("options").style.display = "none";
        document.getElementById("doAsList").style.display = "unset";
        document.getElementById("change").innerText = "Einstellungen"
        sort_byO = sort_by;
        sort_by = document.getElementById("showingType").value;
        subredditO = subreddit;
        subreddit = document.getElementById("community").value;
        saveData = document.getElementById("dataSave").checked;


        type = "watching";
        if (sort_byO != sort_by) {
            after = "";
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            get(1);
            updated()
        }
        if (subredditO != subreddit) {
            after = "";
            url = 'https://www.reddit.com/r/' + subreddit + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after;
            get(1);
            updated()
        }
    }
}

console.log("reddit JS Loaded");