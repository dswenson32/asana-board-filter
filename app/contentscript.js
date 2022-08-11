console.log("Asana board filter loaded...");

// Constants
const filterCardsToolStyle = {
    cursor: "pointer",
    "font-size": "12px",
    height: "28px",
    "line-height": "28px",
    padding: "0 8px",
    background: "var(--color-button-background-subtle)",
    "border-color": "var(--color-button-background-subtle)",
    color: "var(--color-text-weak)",
    fill: "var(--color-text-weak)"
}

const filterInputStyle = {
    width: "140px",
    position: "relative",
    "border-color": "var(--color-inverse-border)",
    "border-radius": "16px",
    "border-style": "solid",
    "border-width": "1px",
    height: "26px",
    "box-sizing": "border-box",
    "margin-right": "5px",
    "padding-left": "10px"
}

const filterToolElement = "<div id=\"filterCardsTool\" role=\"button\" aria-expanded=\"false\" tabindex=\"0\">" +
                            "<input id=\"textFilterInput\"> Filter Cards </div>";


// Wait until element is rendered, checking on an interval                            
function getElementUntilRendered(parent, query, wait) {
    return new Promise ((resolve, reject) => {
        function iter(counter) {
            if(counter*wait >= 500) {
                return reject()
            }
            const e = parent.querySelector(query)
            if(e) {
                return resolve(e)
            } else {
                return setTimeout(iter.bind(this, counter+1), wait)
            }
        }
        iter(0)
    })
}

const createFilterTool = function(){
    console.log('Inserting filter tool');
    // Add filter to right toolbard
    document.getElementsByClassName('PageToolbarStructure-rightChildren')[0].insertAdjacentHTML('afterbegin', filterToolElement);

    // Apply styling to tool and text box
    Object.keys(filterCardsToolStyle).forEach(key => {
        document.getElementById("filterCardsTool").style[key] = filterCardsToolStyle[key]
    });

    Object.keys(filterInputStyle).forEach(key => {
        document.getElementById("textFilterInput").style[key] = filterInputStyle[key]
    });

    // Define filter logic, configure debounce function, trigger it when filter input updates
    let performFilter = function () {
        console.log("We're filtering now...")
        let filterText = document.getElementById('textFilterInput').value;
        var elements = document.getElementsByClassName('BoardColumnWithSortableTasks-sortableItemWrapper--boardsRevamp');
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            let cardText = element.innerText
            if (!cardText.toLowerCase().includes(filterText.toLowerCase())) {
                element.style.display = "none"
            } else {
                element.style.display = ""
            }
        }
    }
    
    function debounce(func, timeout = 250) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    document.getElementById("textFilterInput").addEventListener('input', debounce(() => performFilter()));
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'TabUpdated') {
      console.log("Thanks for the update chief: " + document.location.href);
      if(document.location.href.includes("board") && !document.getElementById("filterCardsTool")){
        getElementUntilRendered(document, '.CustomizeMenuButton-notificationIndicatorButtonContainer', 100).then(createFilterTool);    
      }
    }
  })