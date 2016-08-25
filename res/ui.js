(function () {
    var header = document.querySelector("header");
    var subtitle = document.querySelector("#main-subtitle");

    var subtitles = [
        "and I build things",
        "I code; therefore I am",
        "and I make stuff",
        "and I have 99 problems, but coding ain't one",
        "yes, those are my feet",
        "and I'm a dreamer",
        "dreamer. designer. developer.",
        "and I live to program",
        "while(me.isAlive) { me.code(); }",
        "code by day. code by night",
        "eat. code. sleep. goto 1.",
        "this is my childhood hobby turned profession"
    ];

    document.onscroll = function () {
        var headerHeight = header.offsetHeight || header.clientHeight;
        var scrollPerc = document.body.scrollTop / headerHeight;
        var maxOffset = 500; 
        
        if (scrollPerc < 0.8 && scrollPerc >= 0)
            header.style["background-color"] = `rgba(0, 0, 0, ${scrollPerc})`;

        if (scrollPerc <= 1 && scrollPerc >= 0)
            header.style["background-position-y"] = `${+scrollPerc * maxOffset}px`;
    };

    var updateText = function () {
        // randomise line thanks to @JacobRelkin http://stackoverflow.com/a/4550514/80428
        var nextQuote = subtitles[Math.floor(Math.random() * subtitles.length)];

        subtitle.style.opacity = 0;
        setTimeout(function () {
            subtitle.innerHTML = nextQuote;
            subtitle.style.opacity = 0.7;
        }, 1000);
    }

    setTimeout(updateText, 100);
    setInterval(updateText, 7000);
})();