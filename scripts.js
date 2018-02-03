//onload
window.onload = function () {
    //functions
    function callBack(parsedGet) {
        console.log("this is parsedGet")
        console.log(parsedGet);
        recursion(parsedGet, "--");

    };

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

    //min tidigare recursion
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
            console.log("current level is " + level + "------") 
            renderElements(n, level);
            recursion(n.answers, level + "--------");
        }
    }

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

function renderElements(objectToPrint, level) {
    let myDiv = document.getElementById("comment-box")

    var commentBox = document.createElement("div");
    commentBox.classList.add("comment-box");
    var nameBox = document.createElement("div");
    myDiv.appendChild(commentBox);
    var likes = document.createTextNode(" Likes: " + objectToPrint["likes"]);
    var commenter = document.createTextNode(objectToPrint["commenter"]);
    var message = document.createTextNode("current level is: " + level + " " + objectToPrint["message"]);
    nameBox.appendChild(commenter);

    commentBox.appendChild(message);
    
    commentBox.appendChild(likes);
    commentBox.appendChild(nameBox);
    myDiv.appendChild(commentBox);
    myDiv.insertAdjacentHTML('beforeend', '<br />');
}

function renderSingleElement(elementType, message) {
    let innerDiv = document.getElementById("comment-box")
    let newElement = document.createElement(elementType)
    let newTextNode = document.createTextNode(`"${message}"`);
    innerDiv.appendChild(newTextNode);
    return innerDiv;
}
//Exec below
httpGet("http://localhost:8080/shallow", callBack);

}; 