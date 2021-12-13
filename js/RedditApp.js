var subreddit = ['memes'];
var sort_by = 'hot';
var sort_time = 'all';
var save_dir = 'default';
var limit = '1';
var after = [];
var afterO = [];
var afterList = [];
var saveData = false;
var subredditId = 0;
var listLoaded = 0
var noDuplicate = false;
var viewedMemes = [];

if (localStorage["RedditViewedMemes"] == undefined) {
    localStorage.setItem("RedditViewedMemes", "[]");
}
viewedMemes = JSON.parse(localStorage["RedditViewedMemes"]);


video_audio = null
video_video = null

//load data
urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("subreddit") != null) {
    subreddit = urlParams.get("subreddit").split(",");
    console.log(subreddit);
} else {
    su = getCookie("RedditSubreddit");
    if (su != null) {
        subreddit = su.split(",");
    }
}


su = getCookie("RedditnoDuplicate");
if (su != null) {
    noDuplicate = JSON.parse(su);
}


function makeAfter() {
    subreddit.forEach(element => {
        after.push([""]);
        afterO.push([""]);
        afterList.push([[]]);
    });
}
makeAfter()

url = 'https://www.reddit.com/r/' + subreddit[subredditId] + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after[subredditId];

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

function addViewed(memeAddress) {
    viewedMemes.push(memeAddress);
    localStorage.setItem("RedditViewedMemes", JSON.stringify(viewedMemes));
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
        if (!now["url"].match(/.(jpg|jpeg|png|gif)$/i)) { } else {
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
            video_video.addEventListener('loadeddata', function () {
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
            video_audio.addEventListener('loadeddata', function () {
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



    document.removeEventListener("scroll", scroll);

    //load comments:
    commntLink = "https://www.reddit.com" + now.permalink + ".json?raw_json=1";
    console.log(commntLink);

    document.querySelector("#comments0").querySelector(".md").innerHTML = "";

    document.querySelector("#imagesEtc").style.marginTop = "31.0351px";

    $.getJSON(commntLink, function (json) {
        loadCommentsRecursively(json["1"], 0, "comments0");
    });
    return;

}

function loadCommentsRecursively(data, indent, tag) {
    if (data["data"] != undefined) {
        comment = data["data"]["children"];
        var i = 0
        if (comment != undefined) {
            comment.forEach(element => {
                if (element.kind == "t1" && i < 10) {
                    console.log();//_html
                    document.querySelector("#" + tag).querySelector(".md").innerHTML += '<div id="' + tag + JSON.stringify(i) + '"><div style="display: flex;margin-left: 1px;" id="' + tag + JSON.stringify(i) + 'a">' + '<div style="width: 1px;background: gray;"></div><div style="width: 5px;"></div>' + element.data.body_html + "</div></div><br>"
                    document.querySelector("#" + tag + JSON.stringify(i)).querySelector(".md").innerHTML = "<h4 style=\"height: 0px;\">" + element.data.author + "</h4>" + document.querySelector("#" + tag + JSON.stringify(i)).querySelector(".md").innerHTML
                    loadCommentsRecursively(element["data"]["replies"], indent + 1, tag + JSON.stringify(i))
                }
                i++;
            });
            if (indent == 0) {
                /*if (document.querySelector("#imagesEtc").offsetHeight < window.innerHeight - document.querySelector("#changMeme").offsetHeight && window.innerWidth > (document.querySelector("#comments").offsetWidth + document.querySelector("#imagesEtc").offsetWidth + 32)) {
                    scrollStandart = document.querySelector("#imagesEtc").getBoundingClientRect().top + document.documentElement.scrollTop
                    document.addEventListener("scroll", scroll);
                    document.querySelector("section").style.display="flex";
                }*/
                window.onresize();
            }
        }
    }
}

window.onresize = function () {
    if (document.querySelector("#imagesEtc").offsetHeight < window.innerHeight - document.querySelector("#changMeme").offsetHeight && window.innerWidth > (document.querySelector("#comments").offsetWidth + document.querySelector("#imagesEtc").offsetWidth + 32)) {
        scrollStandart = document.querySelector("#imagesEtc").getBoundingClientRect().top + document.documentElement.scrollTop
        document.addEventListener("scroll", scroll);
        document.querySelector("section").style.display="flex";
    } else {
        document.removeEventListener("scroll", scroll);
        document.querySelector("#imagesEtc").style.marginTop = "31.0351px";
        document.querySelector("section").style.display="unset";
    }
    console.log("resize");
}

function scroll() {
    //if (JSON.parse(document.querySelector("#imagesEtc").style.marginTop.replace("px", "")) < window.scrollY) { scrollStandart -= 1; }
    if (window.scrollY < scrollStandart) { document.querySelector("#imagesEtc").style.marginTop = scrollStandart; }
    else { document.querySelector("#imagesEtc").style.marginTop = window.scrollY - scrollStandart + "px"; }
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
    urls.forEach(function (url) {
        preloadImage(url, function () {
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
    document.querySelector("#next").innerHTML = "<br>...";
    if (i == 0 || i == -1) {
        url = 'https://www.reddit.com/r/' + subreddit[subredditId] + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after[subredditId];
    }
    $.getJSON(url, function (json) {
        document.querySelector("#next").innerHTML = "<br>-->";
        after[subredditId] = json["data"]["after"];

        j = json;

        console.log(url);
        now = json["data"]["children"][0]["data"];
        if (viewedMemes.includes(now.permalink) && noDuplicate) {
            if (i == 1 || i == 2 || i == -1) { get(-1); } else { get(0); }
            return;
        } else if (noDuplicate) {
            addViewed(now.permalink)
        }
        if (i == -1 && noDuplicate) {
            next();
        }



        preloadImages(getImg(now));

        if (i == 1) {
            afterO[subredditId] = after[subredditId]
            title = document.getElementById("title")
            text = document.getElementById("text")
            img = document.getElementById("img")
            load(now, title, text, img);
            url = 'https://www.reddit.com/r/' + subreddit[subredditId] + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after[subredditId];
            get(0)
        }
        if (i == 2) {
            afterO[subredditId] = after[subredditId]
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

if (after[subredditId] == "") {
    get(1)
} else {
    url = 'https://www.reddit.com/r/' + subreddit[subredditId] + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after[subredditId];
    get(2);
}

async function next() {
    subredditId += 1;
    if (subredditId >= subreddit.length) { subredditId = 0; }
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
    setLoc(subreddit.join(","), afterO[subredditId], sort_by)

    //back
    afterList[subredditId].push(afterO[subredditId]);
    if (afterList[subredditId].length > 15) {
        afterList[subredditId].shift();
    }

    //show and load new
    load(now, title, text, img);
    //url = 'https://www.reddit.com/r/' + subreddit[subredditId] + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after[subredditId];
    afterO[subredditId] = after[subredditId]
    get(0)

    document.querySelector('#title').scrollIntoView({
        behavior: 'smooth'
    });
    setCookie("washere", "true", 0.1);
}

function setLoc(subredd, aft, sort_) {
    //removed, because spam
    let newUrlIS = window.location.origin + window.location.pathname + '?page=' + urlParams.get("page") + '&subreddit=' + subredd;// + "&after=" + aft + "&sort=" + sort_;
    history.pushState({}, null, newUrlIS);
}

function back() {
    subredditId--;
    if (subredditId < 0) { subredditId = subreddit.length - 1; }
    afterO[subredditId] = afterList[subredditId][afterList[subredditId].length - 2];
    after[subredditId] = afterList[subredditId][afterList[subredditId].length - 1];
    afterList[subredditId].pop();

    setLoc(subreddit.join(","), afterO[subredditId], sort_by)

    url = 'https://www.reddit.com/r/' + subreddit[subredditId] + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + afterO[subredditId];
    get(1);
}

type = "watching"


function list() {
    document.getElementById("changMeme").style.display = "none";
    document.querySelector("#doAsList").innerText = "Mehr Laden";
    if (document.getElementById("Post") != null) { document.getElementById("Post").remove(); }
    var max = 50;
    listLoaded = max + listLoaded + 1;
    listLoadFunction(listLoaded, listLoaded - max);
}
async function listLoadFunction(max, i) {

    subredditId += 1;
    if (subredditId >= subreddit.length) { subredditId = 0; }

    url = 'https://www.reddit.com/r/' + subreddit[subredditId] + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after[subredditId];
    $.getJSON(url, function (json) {

        after[subredditId] = json["data"]["after"];
        j = json;
        now = json["data"]["children"][0]["data"];

        imgs = getImg(now)

        document.getElementById("postSection").innerHTML += "<div id='post_" + i + "'></div>";


        link = "https://reddit.com" + now["permalink"]
        document.getElementById("post_" + i).innerHTML += "<p style='padding-bottom: 20%;'></p><h1 class='title'>" + now["title"] + "</h1>" + "<a target='_blank' href='" + link + "'>reddit.com</p>";;
        document.getElementById("post_" + i).innerHTML += "<div class='text'><p>" + selftext + "</p></div>";
        if (now["selftext_html"] != null) { selftext = now["selftext_html"] } else { selftext = "" }
        for (x in imgs) {
            document.getElementById("post_" + i).innerHTML += "<img src='" + imgs[x] + "' width='100%' height='100%' alt='bild'></img>";
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
        if (i < max) { listLoadFunction(max, i + 1); }
    });
}

function newCommunity() {
    subreddit.push("")
    type = "watching";
    change();
}
function removeSubreddit(i) {
    subreddit.splice(i, 1);
    type = "watching";
    change();
}


function updated() {
    setCookie("RedditSubreddit", subreddit.join(","), 365);
    setCookie("RedditSort", sort_by, 365);
    setLoc(subreddit.join(","), afterO[subredditId], sort_by)
}

updated()

function change() {
    if (type == "watching") {
        document.getElementById("Post").style.display = "none";
        document.getElementById("changMeme").style.display = "none";
        document.getElementById("change").innerText = "Fertig";
        document.getElementById("options").style.display = "unset";
        document.getElementById("doAsList").style.display = "none";
        document.getElementById("showingType").value = sort_by;
        document.getElementById("NoDuplicate").checked = noDuplicate;


        document.querySelectorAll(".subbreddit").forEach(valu => {
            valu.remove()
        });
        var i = 0;
        subreddit.forEach(element => {
            document.querySelector("#subreddits").innerHTML += '<div class="subbreddit"><input type="text" class="community" value="' + subreddit[i] + '"><button style="font: 200%;" onclick="removeSubreddit(' + i + ');">-</button></div>'
            i++;
        });

        type = "changeing"
    } else if (type == "changeing") {
        document.getElementById("Post").style.display = "unset";
        document.getElementById("changMeme").style.display = "inline-table";
        document.getElementById("options").style.display = "none";
        document.getElementById("doAsList").style.display = "unset";
        document.getElementById("change").innerText = "Einstellungen";

        setCookie("RedditnoDuplicate", JSON.stringify(document.getElementById("NoDuplicate").checked), 100);

        if (noDuplicate != document.getElementById("NoDuplicate").checked) {
            localStorage.setItem("RedditViewedMemes", "[]");
        }
        noDuplicate = document.getElementById("NoDuplicate").checked;

        sort_byO = sort_by;
        sort_by = document.querySelector("#showingType").value;
        subredditO = subreddit;

        subreddit=[];
        document.querySelectorAll(".community").forEach(element => {
            subreddit.push(element.value);
        });
        makeAfter();

        saveData = document.getElementById("dataSave").checked;

        subredditId = 0;


        type = "watching";
        if (subredditO != subreddit || sort_byO != sort_by) {
            after[subredditId] = "";
            url = 'https://www.reddit.com/r/' + subreddit[subredditId] + '/' + sort_by + '/.json?raw_json=1&t=' + sort_time + '&limit=' + limit + "&after=" + after[subredditId];
            get(1);
            updated()
        }
    }
}

console.log("reddit JS Loaded");