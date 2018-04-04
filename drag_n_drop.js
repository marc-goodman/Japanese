$(
  function() {
    var rows = [];
    var tiles = [];
    var start = 0;
    var timer = 0;
    var hits = 0;
    var misses = 0;
    var total = 0;
    var fonts = [
      { name: "Arial", family: "Arial"},
      { name: "Cat Cafe", family: "CatCafe" },
      { name: "Pomeranian", family: "Pomeranian" },
      { name: "Shigoto Memogaki", family: "Shigoto" },
      { name: "Sanafon Yu", family: "Sanafon" },
      { name: "Hakusyu Kaisyo", family: "HakusyuKaisyo" },
      { name: "Han Serif", family: "SourceHanSerif" },
      { name: "Rii Pop", family: "RiiPop"},
      { name: "Eri Ji", family: "EriJi"},
      { name: "Random Mixed", family: "Random"}
    ];
    
    function updateDisplay() {
      var now = new Date().getTime();
      var elapsed = Math.floor((now - start) / 1000);
      var m = Math.floor(elapsed / 60);
      var s = (elapsed % 60).toString();
      if (s.length < 2)
        s = '0' + s;
      $('#timer').text('Elapsed Time: ' + m + ':' + s + ', ' + hits + '/' + total + ' Correct, ' + misses + ' Mistakes');
    }
    
    function startTimer() {
      if (timer)
        return;
      start = new Date().getTime();
      updateDisplay();
      timer = setInterval(updateDisplay, 1000);
    }
    
    function success() {
      updateDisplay();
      clearInterval(timer);
    }
    
    function makeFontSelections() {
      var select = $('#fonts');
      fonts.forEach(function(font) {
        select.append($('<option value="' + font.family + '">' + font.name + '</option>'));
      });
      select.change(function() {
        var family = select.val();
        
        if (family == 'Random') {
          $('.tile').each(function() {
            $(this).css('font-family', fonts[Math.floor( (fonts.length - 1) * Math.random() )].family);
          });
        } else {
          $('.tile').css('font-family', select.val());
        }
      });
    }
    
    for (var i = 0; i < 5; i++) {
      rows[i] = $('<div></div>');
    }
    
    letters.forEach(function (l, index) {
      if (l.letter == 'skip') {
        var tile = null;
        var target = $('<div class="skip">&nbsp;</div>');
      } else {
        var tile = $('<div class="tile" data-char="' + l.letter + '"><span class="letter">' + l.code + '</span></div>');
        var target = $('<div class="target" data-char="' + l.letter + '"><span class="letter">' + l.letter + '</span></div>');
      }
      rows[index % 5].append(target);
      if (tile) {
        tile.data('order', Math.random());
        tiles.push(tile);
      }
    });
    total = tiles.length;
    rows.forEach(function (r) { $('#targets').append(r); });
    for (var i = 0; i < 5; i++) {
      rows[i] = $('<div></div>');
      $('#tiles').append(rows[i]);
    }
    tiles.sort(function(a, b) {
      var v1 = a.data('order'), v2 = b.data('order');
      if (v1 < v2) return -1;
      if (v1 > v2) return 1;
      return 0;
    }).forEach(function (tile, index) {
      rows[index >> 4].append(tile);
    });
    $('.tile').draggable({
      revert: function(target) {
        if (!target)
          return true;
        if (this.data('char') != target.data('char')) {
          misses++;
          return true;
        }
        hits++;
        var spos = this.position();
        var tpos = target.position();
        this.position({
          my: "top left",
          at: "top left",
          of: target
        }, 'slow');
        if (hits == total)
          success();
        return false;
      },
      revertDuration: 100,
      start: function() {
        $(this).css('z-index', 20);
      },
      stop: function() {
        $(this).css('z-index', 10);
      }
    });
    $('.target').droppable({
      classes: {
        "ui-droppable-hover": "droppable_hover"
      }
    });
    makeFontSelections();
    startTimer();
  }
)