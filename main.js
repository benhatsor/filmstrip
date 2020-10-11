function makeDraggable(dragItem) {
  var active = false;
  var click = false;
  var currentX;
  var currentY;
  var initialX;
  var initialY;
  var xOffset = 20;
  var yOffset = 20;

  dragItem.addEventListener("touchstart", dragStart, false);
  dragItem.addEventListener("touchend", dragEnd, false);
  dragItem.addEventListener("touchmove", drag, false);

  dragItem.addEventListener("mousedown", dragStart, false);
  dragItem.addEventListener("mouseup", dragEnd, false);
  dragItem.addEventListener("mousemove", drag, false);

  function dragStart(e) {
    xOffset = x[currentIndex];
    yOffset = y[currentIndex];

    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    active = true;
    click = true;
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;

    if (click == true) {
      console.log('staticClick');
    }
  }

  function drag(e) {
    if (active) {
      e.preventDefault();

      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      dragItem.style.left = currentX + 'px';
      dragItem.style.top = currentY + 'px';

      x[currentIndex] = currentX;
      y[currentIndex] = currentY;

      document.querySelectorAll('.frame')[currentIndex].children[0].children[0].style.left = currentX / 10 + 'px';
      document.querySelectorAll('.frame')[currentIndex].children[0].children[0].style.top = currentY / 10 + 'px';

      click = false;
    }
  }
}

var x = [20];
var y = [20];

var currentIndex = 0;

function open(index) {
  currentIndex = index;

  document.querySelector('.draggable').style.left = x[currentIndex] + 'px';
  document.querySelector('.draggable').style.top = y[currentIndex] + 'px';
	
  if (!document.querySelector('.play').classList.contains('playing')) {
    document.querySelector('.draggable').style.transition = '.2s';
    window.setTimeout(function() {
      document.querySelector('.draggable').style.transition = '';
    }, 200);
  }

  document.querySelectorAll('.frame').forEach(el => {
    el.classList.remove('open');
  })
  document.querySelectorAll('.frame')[currentIndex].classList.add('open');
}

document.querySelectorAll('.frame').forEach(function(el, i) {
  el.addEventListener('click', e => {
    open(i);
  })
})

function create(htmlStr) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function playFrame() {
	if (settings.replay) {
    document.querySelector('.draggable').style.transition = settings.delay+'s linear';
    if (currentIndex == x.length-1) {
      currentIndex = -1;
    }
    if (document.querySelector('.play').classList.contains('playing')) {
      window.setTimeout(function() {
        open(currentIndex+1);
        playFrame();
      }, settings.delay*1000)
    }
    else {
      window.setTimeout(function() {
        document.querySelector('.draggable').style.transition = '';
        open(startFrame);
      }, settings.delay*1000)
    }
  }
  else {
  	document.querySelector('.draggable').style.transition = settings.delay+'s linear';
    if (currentIndex < x.length-1) {
      if (document.querySelector('.play').classList.contains('playing')) {
        window.setTimeout(function() {
          open(currentIndex+1);
          playFrame();
        }, settings.delay*1000)
      }
      else {
        window.setTimeout(function() {
          document.querySelector('.draggable').style.transition = '';
          open(startFrame);
        }, settings.delay*1000)
      }
    }
    else {
    	document.querySelector('.draggable').style.transition = '';
      document.querySelector('.play').classList.remove('playing');
    }
  }
}

function exportAnimation() {
	var out = `.el {
  animation: `+settings.name.replaceAll(' ', '-')+` `+settings.delay * x.length+`s linear forwards;
  position: absolute;
}
  
@keyframes `+settings.name.replaceAll(' ', '-')+` {`;
  for (var i = 0; i < x.length; i++) {
    out += `
  `+100 / (x.length-1) * i + `% {
    top: `+y[i]+`px;
    left: `+x[i]+`px;
  }`;
  }
  return (out + `
}`);
}

function copy(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

function select(node) {
    node.focus();
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

document.querySelector('.add').addEventListener('click', e => {
  currentIndex += 1;

  x.splice(currentIndex, 0, x[currentIndex - 1]);
  y.splice(currentIndex, 0, y[currentIndex - 1]);

  var frame = create('<div class="frame open" style="opacity:0"><div class="frame-wrapper"><div class="frame-el"></div></div></div>');
  insertAfter(document.querySelector('.sidebar').children[currentIndex - 1], frame);
  window.setTimeout(function() {
    document.querySelectorAll('.frame')[currentIndex].style.opacity = 1;
    document.querySelectorAll('.frame')[currentIndex].scrollIntoView({behavior: "smooth"});
    
    document.querySelectorAll('.frame')[currentIndex].children[0].children[0].style.left = x[currentIndex - 1] / 10 + 'px';
      document.querySelectorAll('.frame')[currentIndex].children[0].children[0].style.top = y[currentIndex - 1] / 10 + 'px';
      
    open(currentIndex);
  }, 0);

  document.querySelectorAll('.frame').forEach(function(el, i) {
    el.addEventListener('click', e => {
      open(i);
    })
  })
})

document.querySelector('.remove').addEventListener('click', e => {
  if (currentIndex != 0) {
    x.splice(currentIndex, 1);
    y.splice(currentIndex, 1);

    document.querySelectorAll('.frame')[currentIndex].style.opacity = 0;
    open(currentIndex - 1);
    window.setTimeout(function() {
      document.querySelectorAll('.frame')[currentIndex + 1].remove();
      document.querySelectorAll('.frame')[currentIndex].scrollIntoView({behavior: "smooth"});
    }, 200);
  }
})

var startFrame = 0;
document.querySelector('.play').addEventListener('click', e => {
  document.querySelector('.play').classList.toggle('playing');
  if (document.querySelector('.play').classList.contains('playing')) {
  	if (currentIndex == x.length-1) {
    	currentIndex = -1;
    }
  	startFrame = currentIndex;
    playFrame();
  }
})

document.querySelector('.save').addEventListener('click', e => {
	document.querySelector('.prompt-wrapper').classList.add('open');
  document.querySelectorAll('.name').forEach(name => {
  	name.innerHTML = settings.name.replaceAll(' ', '-');
  });
  document.querySelector('.export').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="copy"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"></path></svg>' + exportAnimation();
})

document.querySelector('.new').addEventListener('click', e => {
  document.querySelector('.sidebar').style.right = '-110px';
  window.setTimeout(function() {
    document.querySelector('.sidebar').innerHTML = '<div class="frame open"><div class="frame-wrapper"><div class="frame-el"></div></div>';
    document.querySelector('.sidebar').style.right = '';
    x = [20];
    y = [20];
    open(0);
  }, 200);
})

function closeWindow() {
	if (confirm('Close window?')) {
    close();
  }
}

window.onbeforeunload = function() {
  return 'Close window?';
};

var settings = {
	name: 'Untitled Animation',
	delay: 0.25,
	replay: false
};

makeDraggable(document.querySelector('.draggable'));

open(0);
