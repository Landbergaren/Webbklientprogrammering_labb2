//Variables
let canAnswer = true;
document.getElementById("sortDropdown").addEventListener("change", function () { httpGet("http://localhost:8080/deep", callBack) });

//Functions
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

function answerComment(id) {
    let commentElement = document.getElementById(id);
    let htmlString = commentElement.innerHTML;
    if (!(htmlString.indexOf("input") >= 0)) {
        let inputElement = document.createElement("input");
        let sendButton = document.createElement("button");
        let sendButtonTxt = document.createTextNode("Send");
        let inputId = id + "a";
        inputElement.setAttribute("id", inputId);
        sendButton.setAttribute("onclick", `sendAnswer("${id}", "${inputId}")`);
        sendButton.appendChild(sendButtonTxt);
        commentElement.appendChild(inputElement);
        commentElement.appendChild(sendButton);
        canAnswer = false;
    }
}

function editComment(id) {
    let editElement = document.getElementById(id);
    let htmlString = editElement.innerHTML;
    if (!(htmlString.indexOf("input") >= 0)) {
        let editButton = createMyElement("button", "Edit");
        let inputElement = document.createElement("input");
        let inputId = id + "b";
        inputElement.setAttribute("id", inputId);
        editButton.setAttribute("onclick", `sendEdit("${id}", "${inputId}")`);
        editElement.appendChild(inputElement);
        editElement.appendChild(editButton);
    }
}

function sendEdit(id, inputId) {
    let inputElement = document.getElementById(`${inputId}`);
    inputValue = inputElement.value;
    httpPost("http://localhost:8080/edit/" + id, "message=" + inputValue + "&deep=true", callBack);
}

function sendAnswer(id, inputId) {
    let inputElement = document.getElementById(`${inputId}`);
    inputValue = inputElement.value;
    httpPost("http://localhost:8080/answer/" + id, "message=" + inputValue + "&deep=true", callBack);
    canAnswer = true;
}

function comment() {
    let comment = document.querySelector("#commentInput")
    let commentValue = comment.value;
    httpPost("http://localhost:8080/comment", "message=" + commentValue + "&deep=true", callBack);
    comment.value = "";
}

function likeComment(id) {
    httpPost("http://localhost:8080/like/" + id,  "&deep=true", callBack);
}

function httpGet(theUrl, callback) {
    const http = new XMLHttpRequest();
    http.open('GET', theUrl, true);
    commentBox = document.getElementById("comment-box");
    commentBox.innerHTML = '';
    
    http.onreadystatechange = function () {

        if (http.readyState == 4 && http.status == 200) {
            callback(JSON.parse(http.responseText));
        }
    };
    http.send(null);
};

function httpPost(theUrl, params, callback) {
    const http = new XMLHttpRequest();
    http.open('POST', theUrl, true);
    commentBox = document.getElementById("comment-box");
    commentBox.innerHTML = '';
    http.setRequestHeader("content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
            callback(JSON.parse(http.responseText));
    };

    http.send(params);
}

function callBack(parsedGet) {
    recursion(parsedGet, "");
};

function recursion(n, level) {
    if (n === undefined) {
        return;
    }
    if (Array.isArray(n)) {
        sortList(n);
        for (var comment of n) {
            let commentBox = renderSingleElement("div", level);
            recursion(comment, level);
        }
    }
    else {
        renderAllComments(n, level);
        recursion(n.answers, level + "----------");
    }
}

function sortList(lst) {
    let choice = document.getElementById("sortDropdown").value;

    if (choice === "Most likes") {
        lst.sort(function (a, b) {
            let x = a.likes;
            let y = b.likes;

            return ((x > y)
                ? -1
                : ((x < y)
                    ? 1
                    : 0));
        });

    }
    if (choice === "least likes") {
        lst.sort(function (a, b) {
            let x = a.likes;
            let y = b.likes;
            return ((x < y)
                ? -1
                : ((x > y)
                    ? 1
                    : 0));
        });
    }
    if (choice === "Oldest") {
        lst.sort(function (a, b) {
            
            let x = Date.parse(a.creation)
            let y = Date.parse(b.creation)
            return ((x < y)
                ? -1
                : ((x > y)
                    ? 1
                    : 0));
        });
    }
    if (choice === "Newest") {
        lst.sort(function (a, b) {
            let x = Date.parse(a.creation);
            let y = Date.parse(b.creation);
            return ((x > y)
                ? -1
                : ((x < y)
                    ? 1
                    : 0));
        });
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
    let likesElement = createMyElement("section", "Likes: " + objectToPrint["likes"])
    let commenter = document.createTextNode(objectToPrint["commenter"]);
    let message = document.createTextNode(objectToPrint["message"]);
    let likeButton = createMyElement("button", "Like");
    let hideButton = createMyElement("button", "Hide/Show");
    let answerButton = createMyElement("button", "Answer");
    let editButton = createMyElement("button", "edit");
    let timeTxt = document.createTextNode(objectToPrint["creation"]);

    //Append    
    answerButton.setAttribute("onclick", `answerComment("${objectToPrint.id}")`);
    editButton.setAttribute("onclick", `editComment("${objectToPrint.id}")`)
    outerBox.appendChild(hideButton);
    hideButton.setAttribute("onclick", `hide("${objectToPrint.id}")`)
    hideButton.classList.add("hide-comment");
    likeButton.setAttribute("onclick", `likeComment("${objectToPrint.id}")`)
    nameBox.appendChild(commenter);
    nameBox.appendChild(likesElement);
    nameBox.appendChild(timeTxt);

    likesElement.appendChild(likeButton);
    likesElement.appendChild(answerButton);
    likesElement.appendChild(editButton);

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

function createMyElement(element, message) {
    let newElement = document.createElement(element);
    let newText = document.createTextNode(message);
    newElement.appendChild(newText);
    return newElement;
}



httpGet("http://localhost:8080/deep", callBack);
