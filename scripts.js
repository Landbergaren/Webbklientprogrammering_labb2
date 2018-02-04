


function hide(id) {
    let currentAttr = document.getElementById(id).getAttribute("style");
    let commentElement = document.getElementById(id.toString())

    if (currentAttr !== "display: none;") {
        commentElement.style.display = "none";
    }
    else {
        commentElement.style.display = "inline-block";
    }
}

function likeComment(id) {
    httpPost("http://localhost:8080/like/" + id, null, callBack);
}

function answerComment(id) {
    let inputElement = document.createElement("input");
    let commentElement = document.getElementById(id);
    let sendButton = document.createElement("button");
    let sendButtonTxt = document.createTextNode("Send");    
    let inputId = id + "a";
    inputElement.setAttribute("id", inputId);
    sendButton.setAttribute("onclick", `sendAnswer("${id}", "${inputId}")`);
    sendButton.appendChild(sendButtonTxt);
    commentElement.appendChild(inputElement);
    commentElement.appendChild(sendButton);
}

function httpPost(theUrl, params, callback) {
    const http = new XMLHttpRequest();
    http.open('POST', theUrl, true);
    document.body.innerHTML = '<button>Comment</button><div id="comment-box"></div>';
    http.setRequestHeader("content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)            
            callback(JSON.parse(http.responseText));
    };

    http.send(params);
}

function callBack(parsedGet) {
    console.log("this is parsedGet")
    console.log(parsedGet);
    recursion(parsedGet, "");
};

function recursion(n, level) {
    if (n === undefined) {
        console.log("and now we are undefined")
        return;
    }
    if (Array.isArray(n)) {
        for (var comment of n) {
            let commentBox = renderSingleElement("div", level)
            recursion(comment, level);
        }
    }
    else {
        renderAllComments(n, level);
        recursion(n.answers, level + "----------");
    }
}

function renderAllComments(objectToPrint, level) {

    let myDiv = document.getElementById("comment-box")

    //Create
    let outerBox = document.createElement("div");
    let commentBox = document.createElement("div");
    let nameBox = document.createElement("div");
    let contentBox = document.createElement("p");
    nameBox.classList.add("comment-box");
    myDiv.appendChild(commentBox);
    let likesTxt = document.createTextNode(objectToPrint["likes"]);
    let likesElement = document.createElement("div");
    let commenter = document.createTextNode(objectToPrint["commenter"]);
    let message = document.createTextNode(objectToPrint["message"]);
    let likeButton = document.createElement("button");
    let likeButtonTxt = document.createTextNode("Like");
    let hideButton = document.createElement("button");
    let hideButtonTxt = document.createTextNode("Hide/show");
    let answerButton = document.createElement("button");
    let answerButtonTxt = document.createTextNode("Answer");

    //Append    
    likesElement.appendChild(likesTxt);
    answerButton.appendChild(answerButtonTxt);
    answerButton.setAttribute("onclick", `answerComment("${objectToPrint.id}")`)
    likeButton.appendChild(likeButtonTxt);
    outerBox.appendChild(hideButton);
    hideButton.setAttribute("onclick", `hide("${objectToPrint.id}")`)
    hideButton.appendChild(hideButtonTxt);
    likeButton.setAttribute("onclick", `likeComment("${objectToPrint.id}")`)
    nameBox.appendChild(commenter);
    nameBox.appendChild(likesElement);

    likesElement.appendChild(likeButton);
    likesElement.appendChild(answerButton);
    commentBox.appendChild(nameBox);
    contentBox.appendChild(message);
    commentBox.appendChild(contentBox);
    commentBox.setAttribute("id", `${objectToPrint.id}`);
    outerBox.appendChild(commentBox);
    myDiv.appendChild(outerBox);

    myDiv.insertAdjacentHTML('beforeend', '<br />');    
}

function renderSingleElement(elementType, message) {
    let innerDiv = document.getElementById("comment-box")
    let newElement = document.createElement(elementType)
    let newTextNode = document.createTextNode(`${message}`);
    innerDiv.appendChild(newTextNode);
    return innerDiv;
}

    function httpGet(theUrl, callback) {
        const http = new XMLHttpRequest();
        http.open('GET', theUrl, true);

        http.onreadystatechange = function () {

            if (http.readyState == 4 && http.status == 200) {
                callback(JSON.parse(http.responseText));
            }
        };
        http.send(null);
    };

    function sendAnswer (id, inputId) {    
        let inputElement = document.getElementById(`${inputId}`);
        inputValue = inputElement.value;
        httpPost("http://localhost:8080/answer/" + id, "message=" + inputValue, callBack);
    }


    httpGet("http://localhost:8080/deep", callBack);
    //min tidigare recursion


    // function recursion(level, node) {
    //     if (Array.isArray(node)) {
    //         for (const child of node) {
    //             recursion(level, child);
    //         }
    //     }
    //     else {
    //         console.log(level, node.message);
    //         for (const child of node.naswers) {
    //             recursion('-' + level, child);
    //         }            
    //     }
    // }


    // function visitAll(level, node) {
    //     if (Array.isArray(node)) {
    //       for (const child of node)          // A loop
    //         visitAll(level, child);          // where we make recursive calls
    //     } else {
    //       console.log(`${level} ${node.message}`);
    //       for (const child of node.answers)  // A loop
    //         visitAll('-' + level, child);    // where we make recursive calls
    //     }
    //   }

    

    //Exec below