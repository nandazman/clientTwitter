// function get coookiesssss 
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function hapusCookie(){
    alert('hapus')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
}

function showAccount(){
    document.getElementById('account').style.display = 'block'
    document.getElementById('password').style.display = 'none'
}

function showPassword(){
    document.getElementById('password').style.display = 'block'
    document.getElementById('account').style.display = 'none'
    
}

function tooltip(){
    if (document.getElementById('tooltipshow').style.visibility == 'visible'){
        document.getElementById('tooltipshow').style.visibility = 'hidden'
        return
    }
    document.getElementById('tooltipshow').style.visibility = 'visible';   
}

function disableButton(){

    if(document.getElementById('tweetBox').value.length > 0) { 
        document.getElementById('submit').disabled = false; 
        document.getElementById('submit').style.cursor = 'pointer';
    } else { 
        document.getElementById('submit').disabled = true;
        document.getElementById('submit').style.cursor = 'no-drop';
    }
}



function signUp(){
    // debugger;
    fullname = document.getElementById('fullname').value;
    username = document.getElementById('username').value;
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    // console.log(fullname,username,email,password)

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/signup");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        "username": username,
        "email": email,
        "password": password,
        "fullname": fullname
    }));

    xhr.onreadystatechange = function() {
        
        if(this.readyState == 4 && this.status == 200){
            respons = JSON.parse(this.response);
            console.log(respons)
            alert(respons.message);
            window.location = "/signIn.html";
        } else if(this.readyState == 4){
            respons = JSON.parse(this.response);
            console.log(respons)
            alert(respons.message);
        }
    };
}


function signIn() {
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.getResponseHeader('Set-Cookie');
    xhr.send(JSON.stringify({
        "username": username,
        "password": password,
    }));

    xhr.onreadystatechange = function() {
        
        // xhr.getResponseHeader('Set-Cookie');
         
        if(this.readyState == 4 && this.status == 200){

            document.cookie = `token=${this.response}`;
            // alert(respon.message + this.status);
            window.location = "/index.html";
            // console.log(this.response);

            // localStorage.setItem('username',this.response);
            // localStorage.getItem('email');
            // window.location = "/";

        } else if(this.readyState == 4){
            respon = JSON.parse(this.response)
            alert(respon.message + this.status);
        }
    };
}

function addTweet(){

    tweet = document.getElementById('tweetBox').value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/addTweet");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    var newTweet = {
        "tweet": tweet,
    }

    xhr.send(JSON.stringify(newTweet));

    xhr.onreadystatechange = function() {
        console.log(this.response)
        if(this.response.message == 'You have to logged in'){
            alert(this.response)
            window.location = "/signIn.html";
        } else {
            if(this.readyState == 4 && this.status < 400){
                // alert("aaa")
                test = JSON.parse(this.response)
                alert(test.message + this.status);
                postTweet = test.data
                // console.log(postTweet)
                document.getElementById('tweetBox').value = ''

                var div = document.createElement('div');
                div.className = 'containerTweet';
                div.id = `tweet${postTweet.id}`
                div.innerHTML = `<div class="avaFeed">
                <img src="${postTweet.photoprofile}">
                </div>
                <div class="akunFeed">
                <span class="akunBold">${postTweet.fullname} </span><span class="akunTipis"> @${postTweet.username} . ${postTweet.date}</span>
                </div>
                <div class="dropFeed">
                    <span onclick="deleteTweet(${postTweet.id})" class="deleteX">X</span>
                </div>
                <div class="contentFeed">
                <p>${postTweet.content}</p>
                </div>
                <div class="buttonFeed">
                <span class="buttonFeeds">Replay 15</span>
                <span class="buttonFeeds">Retweet 15</span>
                <span class="buttonFeeds">Like 15</span>
                <span class="buttonFeeds">Direct Message</span>
                </div>`;

                var list = document.getElementById("postedTweet");
                list.insertBefore(div, list.childNodes[0]);
                document.getElementById('submit').disabled = true;
                document.getElementById('submit').style.cursor = 'no-drop';

            } else if(this.readyState == 4){
                alert(this.response.message + this.status);
            }
        }
    };
}

function allTweet() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5000/getTweet")
    xhr.setRequestHeader("Authorization", getCookie('token'));
    xhr.send()
    xhr.onreadystatechange = function(){
        // console.log(this.response)
        if(this.response.message == 'You have to logged in'){
            alert(this.response.message)
            window.location = "/signIn.html";
        } else {
            if(this.readyState == 4 && this.status == 200){
                hasil = JSON.parse(this.response)
                hasil.data.forEach((data,index) => { /*index ga dipake juga gpp*/
                    // data.forEach((tweet,index) => {
                        // console.log(data)
                    
                        document.getElementById('postedTweet').insertAdjacentHTML("afterbegin", `<div class="containerTweet" id="tweet${data.id}">
                        <div class="avaFeed">
                        <img src="${data.photoprofile}">
                    </div>
                    <div class="akunFeed">
                        <a href="profile.html?id=${data.personId}"><span class="akunBold">${data.fullname} </span><span class="akunTipis"> @${data.username}</span></a> . <span class="akunTipis">${data.date}</span>
                    </div>
                    <div class="dropFeed">
                        <span onclick="deleteTweet(${data.id})" class="deleteX">X</span>
                    </div>
                    <div class="contentFeed">
                        <p>${data.content}</p>
                    </div>
                    <div class="buttonFeed">
                        <span class="buttonFeeds">Replay 15</span>
                        <span class="buttonFeeds">Retweet 15</span>
                        <span class="buttonFeeds">Like 15</span>
                        <span class="buttonFeeds">Direct Message</span>
                    </div>
                    </div>`)            
                // })     
                });

            } else if(this.readyState == 4){
                alert("Error dengan status code: " + this.status + " " + this.statusText)
            }
        }
    };
    
}

function allTweetUser(id) {

    var xhr = new XMLHttpRequest();
    // var root =  + localStorage.getItem('username')
    xhr.open("POST", "http://localhost:5000/user");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    user = {
        'id' : id
    }
    // console.log(user)
    xhr.send(JSON.stringify(user))
    xhr.onreadystatechange = function(){
        // console.log(this.response)
        if(this.readyState == 4 && this.status == 200){
            hasil = JSON.parse(this.response)
            hasil.data.forEach((data,index) => { /*index ga dipake juga gpp*/
                // data.forEach((tweet,index) => {
                //     console.log(tweet.content)
                
                    document.getElementById('postedTweet').insertAdjacentHTML("afterbegin", `<div class="containerTweet" id="tweet${data.id}">
                    <div class="avaFeed">
                    <img src="${data.photoprofile}">
                  </div>
                  <div class="akunFeed">
                    <span class="akunBold">${data.fullname} </span><span class="akunTipis"> @${data.username} . ${data.date}</span>
                  </div>
                  <div class="dropFeed">
                    <span onclick="deleteTweet(${data.id})" class="deleteX">X</span>
                  </div>
                  <div class="contentFeed">
                    <p>${data.content}</p>
                  </div>
                  <div class="buttonFeed">
                    <span class="buttonFeeds">Replay 15</span>
                    <span class="buttonFeeds">Retweet 15</span>
                    <span class="buttonFeeds">Like 15</span>
                    <span class="buttonFeeds">Direct Message</span>
                  </div>
                </div>`)
                   
            });

        } else if(this.readyState == 4){
            alert("Error dengan status code: " + this.status + " " + this.statusText)
        }
    };
}


function deleteTweet(id){
    // console.log(id)

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:5000/deleteTweet");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    xhr.send(JSON.stringify({
        "tweet_id": id
    }));

    xhr.onreadystatechange = function() {
        
        if(this.readyState == 4 && JSON.parse(this.response).message == 'You have to logged in'){
            alert(this.response.message)
            window.location = "/signIn.html";
        } else {
            if(this.readyState == 4 && this.status < 400){
                console.log(this.response)
                // document.getElementById(id).style.display = "none";
                document.getElementById(JSON.parse(this.response).data).remove()
            } else if(this.readyState == 4){
                alert(JSON.parse(this.response).message + this.status);
            }
        }
    }
        
}


function showAccountData() {
    // alert("ini jalan")
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/getdata");
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    // var username = {
    //     'username': localStorage.getItem('username')
    // }
    // console.log(username)
    xhr.send();

    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && JSON.parse(this.response).sukses == false){
            alert(JSON.parse(this.response).message)
            window.location = "/signIn.html";
        }
        if(this.readyState == 4 && this.status < 400){
            // console.log(this.response)
            var User = JSON.parse(this.response).data
            for (key in User) {
                if (User[key] == null){
                    User[key] = ''
                }
            }
            document.getElementById('form-account').insertAdjacentHTML('afterbegin', `<form onsubmit="event.preventDefault(); editData()" method="PUT">
            <div class="display-form">
              <label for="username">User Name</label>
              <input type="text" id="username" name="username" placeholder="User Name" value="${User.username}" required />
            </div>
            <div class="display-form">
              <label for="fullname">User Name</label>
              <input type="text" id="fullname" name="fullname" placeholder="Full Name" value="${User.fullname}" required />
            </div>
            <div class="display-form">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" value="${User.email}" required/>
            </div>
            
            <div class="display-form">
              <label for="bio">Bio</label>
              <input type="text" id="bio" name="bio" placeholder="Bio" value="${User.bio}"required/>
            </div>
            <div class="display-form">
              <label for="profile_images">Profile Picture</label>
              <input type="text" id="profile_images" name="profile_images" placeholder="Profile Images" value="${User.photoprofile}" required/>
            </div>
            <div class="display-form">
              <label></label>
              <button id="submitkeun" type="submit">Save Changes</button>
            </div>
          
          </form>`)
        } else if (this.readyState == 4){
            alert("something wrong" + this.status)  
        }
    }
}

function editData(){
    alert('jalan cuy');
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:5000/editprofile");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    var profile = {
        'username': document.getElementById('username').value,
        'fullname': document.getElementById('fullname').value,
        'email': document.getElementById('email').value,
        'bio': document.getElementById('bio').value,
        'photoURL': document.getElementById('profile_images').value
    }
    // console.log(profile)
    xhr.send(JSON.stringify(profile));

    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && JSON.parse(this.response).sukses == false){
            alert(this.response)
            window.location = "/signIn.html";
        } else {
            if (this.readyState == 4 && this.status < 400){
                alert(JSON.parse(this.response).message + this.status)
            } else if (this.readyState == 4){
                alert(JSON.parse(this.response).message + this.status)  
            }
        }
    }
}

function editPassword() {
    // alert("ini jalan")
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:5000/passchange");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    var password = {
        'password': document.getElementById('current-password').value,
        'newPassword': document.getElementById('new-password').value,
        'rePassword': document.getElementById('retype-password').value
    }
    // console.log(password)
    xhr.send(JSON.stringify(password));
    document.getElementById('current-password').value = ''
    document.getElementById('new-password').value = ''
    document.getElementById('retype-password').value = ''
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && JSON.parse(this.response).message == 'You have to logged in'){
            alert('aaa')
            alert(JSON.parse(this.response).message)
            window.location = "/signIn.html";
        } else {
            if (this.readyState == 4 && this.response < 400){
                alert(JSON.parse(this.response).message + this.status)
            } else if (this.readyState == 4){
                alert(JSON.parse(this.response).message + " " + this.status)  
            }
        }
    }
}


function suggestFollow(){
    // alert('ini follow')
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/showsuggestion");
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    // var username = {
    //     'username': localStorage.getItem('username')
    // }
    // console.log(username)
    xhr.send()
    xhr.onreadystatechange = function() {
        // console.log(this.response)
        // console.log(this.readyState, this.response)
        if(this.readyState == 4 && JSON.parse(this.response).message == 'You have to logged in'){
            alert(JSON.parse(this.response).message)
            window.location = "/signIn.html";
        } else {
            if (this.readyState == 4 && this.status < 400){
                userSuggestion = JSON.parse(this.response).data
                userSuggestion.forEach(data => {
                    document.getElementById('suggestion-account').insertAdjacentHTML('afterbegin',`<div class="suggest-akun" >
                    <div class="ava">
                    <img src="${data.photoprofile}">
                    </div>
                    <div class="idfollow">
                    <a href="profile.html?id=${data.id}"<span class="userother">${data.fullname} </span><span class="idother">@${data.username}</span></a>
                    <br>
                    <button class="follow-button" onclick="followButton(${data.id})" id="user${data.id}">follow</button>
                    </div>
                </div>
                <hr class="hrstyle">`)
                })
            }
        }
    }
    
}

function followButton(id){
    // alert('ini follow'+id)
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:5000/follow");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    var follow = {
        'followID': id
    }
    // console.log(follow)
    xhr.send(JSON.stringify(follow))

    xhr.onreadystatechange = function () {
        if(this.readyState == 4 && JSON.parse(this.response).sukses == false){
            alert(JSON.parse(this.response).message)
            
        } else {
            if (this.readyState == 4 && this.status < 400){
                id = "user" + id
                document.getElementById(id).innerHTML = 'Followed'
                document.getElementById(id).style.color = 'white'
                document.getElementById(id).style.backgroundColor = 'blue'
            }
        }
    }
}

function showStatus(){
    // alert("ini buat status")
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/showstats");
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    // username = getCookie('token')
    // var user = {
        // 'username': username,
    // }
    // console.log(user)
    xhr.send()

    xhr.onreadystatechange = function(){
        // alert(this.response)
        if(this.readyState == 4 && JSON.parse(this.response).sukses == false){
            alert(JSON.parse(this.response))
            // window.location = "/signIn.html";
        } else {
            if(this.readyState == 4 && this.status < 400){
                statusId = JSON.parse(this.response).data;
                console.log(statusId.id)
                document.getElementById('lower-profile').insertAdjacentHTML('afterbegin', `<div id="foto-profil">
                <img src="${statusId.photoprofile}">
            </div>
            <div id="nama-profil">
                <a href="profile.html?id=${statusId.id}"><h3>${statusId.fullname}</h3></a>
                <a href="profile.html?id=${statusId.id}"><h4>@${statusId.username}</h4></a>
            </div>
            <div id="tweets-status">
                <div class="tweets-status">
                <h4>Tweets</h4>
                <p>${statusId.tweets}</p>
                </div>
                <div class="tweets-status">
                <h4>Following</h4>
                <p>${statusId.following}</p>
                </div>
                <div class="tweets-status">
                <h4>Followers</h4>
                <p>${statusId.followers}</p>
                </div>
                
            </div>`)
            document.getElementById("fotoBoxTweet").src = `${statusId.photoprofile}`; 
            // document.getElementById("imgTooltip").src = `${statusId.photoprofile}`; 
            document.getElementById("theTooltip").insertAdjacentHTML('afterbegin',`<img id="imgTooltip" src="${statusId.photoprofile}" onclick="tooltip()">
            <div class="tooltiptext" id="tooltipshow">
              <a href="profile.html?id=${statusId.id}"><h3>${statusId.fullname}</h3></a>
              <a href="profile.html?id=${statusId.id}"><h4>@${statusId.username}</h4></a>
              <hr>
              <a href="setting.html"><h5>Setting and privacy</h5></a>
              <a href="signIn.html"><h5 onclick="hapusCookie()">Log Out</h5></a>
            </div>`)
            }
        }
    }
}


function showTrending(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5000/trending");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    xhr.send()

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && JSON.parse(this.response).sukses == false){
            // alert(JSON.parse(this.response).message)
            // window.location = "/signIn.html";
        } else if(this.status < 400){
            trending = JSON.parse(this.response).data
        }
        
        trendK = Object.keys(trending)
        document.getElementById("trend-list").insertAdjacentHTML('afterbegin',`<li>${trendK[0]}
        <p>${trending[trendK[0]]} tweets</p>
      </li>
      <li>${trendK[1]}
          <p>${trending[trendK[1]]} tweets</p>
      </li>
      <li>${trendK[2]}
          <p>${trending[trendK[2]]} tweets</p>
      </li>
      <li>${trendK[3]}
          <p>${trending[trendK[3]]} tweets</p>
      </li>
      <li>${trendK[4]}
          <p>${trending[trendK[4]]} tweets</p>
      </li>
      <li>${trendK[5]}
          <p>${trending[trendK[5]]} tweets</p>
      </li>
      <li>${trendK[6]}
          <p>${trending[trendK[6]]} tweets</p>
      </li>
      <li>${trendK[7]}
          <p>${trending[trendK[7]]} tweets</p>
      </li>
      <li>${trendK[8]}
          <p>${trending[trendK[8]]} tweets</p>
      </li>
      <li>${trendK[9]}
          <p>${trending[trendK[9]]} tweets</p>
      </li>`)
    }
}


function showStatusProfile(){
    // alert("ini buat status")
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/showstats");
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", getCookie('token'));
    // username = getCookie('token')
    // var user = {
        // 'username': username,
    // }
    // console.log(user)
    xhr.send()

    xhr.onreadystatechange = function(){
        if(this.readyState == 4 && JSON.parse(this.response).sukses == false){
            alert(JSON.parse(this.response).message)
            window.location = "/signIn.html";
        } else {
            if(this.readyState == 4 && this.status < 400){
                statusId = JSON.parse(this.response).data;
                console.log(statusId.photoprofile)
                
                document.getElementById("header-stat").insertAdjacentHTML('afterbegin', `<img src="${statusId.photoprofile}" alt="aaa">
                <div id="status-counter">
                <ul id="status-bar">
                    <li>Tweets<br>
                    ${statusId.tweets}
                    </li>
                    <li>Following<br>
                    ${statusId.following}
                    </li>
                    <li>Followers<br>
                    ${statusId.followers}
                    </li>
                </div>
                <p>Edit profile</p>`)
                document.getElementById("profile").insertAdjacentHTML('afterbegin',`<a href="profile.html?id=${statusId.id}"><h3>${statusId.fullname}</h3></a>
                <a href="profile.html?id=${statusId.id}"><h4>@${statusId.username}</h4></a>
                <h4>${statusId.bio}</h4>`)
                
            }
        }
    }
}